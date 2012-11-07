using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel.Web;
using NDesk.Options;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Time;

namespace ATUAV_RT
{
    /// <summary>
    /// Processes ATUAV eyetracking data in real-time.
    /// 
    /// Requires:
    /// - Tobii SDK 3.0 RC 1 http://www.tobii.com/en/eye-tracking-research/global/landingpages/analysis-sdk-30rc/
    /// - FixDet http://www.sis.uta.fi/~csolsp/projects.php
    /// - NDesk.Options http://www.ndesk.org/Options
    /// </summary>
    public class Program
    {
        private static Clock clock;
        private static Settings settings = new Settings();
        private static readonly Dictionary<String, EmdatProcessor> processors = new Dictionary<String, EmdatProcessor>();

        public static Dictionary<String, EmdatProcessor> Processors
        {
            get
            {
                return processors;
            }
        }

        public static Settings Settings
        {
            get
            {
                return settings;
            }
        }

        /// <summary>
        /// Parses arguments and finds connected Eyetrackers.
        /// </summary>
        /// <param name="args">Command line arguments</param>
        static void Main(string[] args)
        {
            if (parseArguments(args))
            {
                initTobiiSdk();
                connectEyetrackers();
                createWebService();
            }
        }

        /// <summary>
        /// Parses command line arguments.
        /// </summary>
        /// <param name="args"></param>
        /// <returns>True if program should continue, false if arguments could not be parsed or help option was called.</returns>
        private static bool parseArguments(string[] args)
        {
            string processorFilePath = null;
            bool help = false;
            var p = new OptionSet()
            {
                { "b|baseAddress=", "{BASE_ADDRESS} for web service", (string v) => Settings.BaseAddress = new Uri(v)},
                { "p|processors=", "{FILEPATH} for processor definitions file", (string v) => processorFilePath = Path.GetFullPath(v)},
                { "h|help", v => help = v != null }
            };

            if (help)
            {
                ShowHelp(p);
                return false;
            }

            try
            {
                List<string> extra = p.Parse(args);

                // check if processorFilePath points to actual file
                if (processorFilePath != null)
                {
                    if (File.Exists(processorFilePath))
                    {
                        ReadProcessorDefinitions(processorFilePath);
                    }
                    else
                    {
                        throw new OptionException("Processor file does not exist. Verify file path.", "p");
                    }
                }

                // check for unparsed arguments
                if (extra.Count > 0)
                {
                    throw new OptionException("Unknown arguments.", "");
                }
            }
            catch (OptionException e)
            {
                Console.WriteLine(e.Message);
                Console.WriteLine("Try \'atuavrt --help\' for more information.");
                Console.WriteLine();
                return false;
            }

            return true;
        }

        private static void ReadProcessorDefinitions(string processorFilePath)
        {
            try
            {
                using (StreamReader sr = new StreamReader(processorFilePath))
                {
                    while (!sr.EndOfStream)
                    {
                        string[] line = sr.ReadLine().Split("\t".ToCharArray(), 2);
                        string eyetrackerProductId = line[0];
                        string[] processorDefinitions = line[1].Split(",".ToCharArray());
                        List<EmdatProcessorSettings> processorSettings = new List<EmdatProcessorSettings>(processorDefinitions.Length);
                        foreach (string processorDefinition in processorDefinitions)
                        {
                            processorSettings.Add(new EmdatProcessorSettings(processorDefinition, processorDefinition.EndsWith("-c")));
                        }
                        Settings.ProcessorDefinitions[eyetrackerProductId] = processorSettings;
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Processor definitions could not be read: " + e.Message);
            }

        }

        /// <summary>
        /// Writes usage to console.
        /// </summary>
        /// <param name="options">Parsed command line arguments</param>
        private static void ShowHelp(OptionSet options)
        {
            Console.WriteLine("Usage: atuav_rt [OPTIONS]");
            Console.WriteLine("Process eyetracking data in real time");
            Console.WriteLine();
            Console.WriteLine("Options:");
            options.WriteOptionDescriptions(Console.Out);
        }

        private static void initTobiiSdk()
        {
            Library.Init();
            clock = new Clock();
        }

        private static void connectEyetrackers()
        {
            EyetrackerBrowser browser = new EyetrackerBrowser(EventThreadingOptions.BackgroundThread);
            browser.EyetrackerFound += EyetrackerFound;
            browser.Start();
        }

        /// <summary>
        /// Connects to found eyetrackers, synchronizes CPU and eyetracker clocks, and attaches event handlers.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains found EyetrackerInfo</param>
        private static void EyetrackerFound(object sender, EyetrackerInfoEventArgs e)
        {
            EyetrackerConnector connector = new EyetrackerConnector(e.EyetrackerInfo);
            connector.Connect();

            // sync CPU and Eyetracker clocks
            SyncManager syncManager = new SyncManager(clock, e.EyetrackerInfo, EventThreadingOptions.BackgroundThread);
            
            // detect fixations
            FixationDetector fixations = new FixationDetector(syncManager);
            connector.Eyetracker.GazeDataReceived += fixations.GazeDataReceived;

            if (Settings.ProcessorDefinitions.ContainsKey(connector.Info.ProductId))
            {
                foreach (EmdatProcessorSettings settings in Settings.ProcessorDefinitions[connector.Info.ProductId])
                {
                    EmdatProcessor processor = new EmdatProcessor(syncManager);
                    processor.CumulativeData = settings.Cumulative;
                    connector.Eyetracker.GazeDataReceived += processor.GazeDataReceived;
                    fixations.FixDetector.FixationEnd += processor.FixationEnd;
                    Processors.Add(settings.ProcessorId, processor);
                }
            }
        }

        private static void createWebService()
        {
            using (WebServiceHost host = new WebServiceHost(typeof(AtuavWebServiceImp), Settings.BaseAddress))
            {
                // Open the ServiceHost to start listening for messages. Since
                // no endpoints are explicitly configured, the runtime will create
                // one endpoint per base address for each service contract implemented
                // by the service.
                host.Open();

                Console.WriteLine("The service is ready at {0}", Settings.BaseAddress);
                Console.WriteLine("Press <Enter> to stop the service.");
                Console.ReadLine();

                // Close the ServiceHost.
                host.Close();
            }
        }
    }
}
