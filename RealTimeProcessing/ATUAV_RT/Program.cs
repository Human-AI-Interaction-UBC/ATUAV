using System;
using System.Collections.Generic;
using System.IO;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.Threading;
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
        private static readonly InterventionEngine interventionEngine = new InterventionEngine();

        // default settings
        private static string aoiFilePath;
        private static Uri baseAddress;
        private static bool cumulativeWindows = false;
        private static bool help = false;

        public static InterventionEngine InterventionEngine
        {
            get
            {
                return interventionEngine;
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
            var p = new OptionSet()
            {
                { "a|aoi=", "{FILEPATH} for areas of interest definitions file", (string v) => aoiFilePath = Path.GetFullPath(v)},
                { "b|baseAddress=", "{BASE_ADDRESS} for web service", (string v) => baseAddress = new Uri(v)},
                { "c|cumulative", "windows collect data cumulatively", v => cumulativeWindows = v != null},
                { "h|help", v => help = v != null }
            };

            try
            {
                List<string> extra = p.Parse(args);

                // check if aoiFilePath points to actual file
                if (aoiFilePath != null && !File.Exists(aoiFilePath))
                {
                    throw new OptionException("AOI file does not exist. Verify file path.", "a");
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

            if (help)
            {
                ShowHelp(p);
                return false;
            }

            return true;
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

            // process windows with EMDAT
            EmdatProcessor processor = new EmdatProcessor(syncManager);
            if (aoiFilePath != null)
            {
                processor.AoiFilePath = aoiFilePath;
            }

            connector.Eyetracker.GazeDataReceived += processor.GazeDataReceived;
            fixations.FixDetector.FixationEnd += processor.FixationEnd;
            interventionEngine.Processors.Add(e.EyetrackerInfo.ProductId, processor);

            processor.StartWindow();
        }

        private static void createWebService()
        {
            using (ServiceHost host = new ServiceHost(typeof(AtuavWebServiceImp), baseAddress))
            {
                // Enable metadata publishing
                ServiceMetadataBehavior behavior = new ServiceMetadataBehavior();
                behavior.HttpGetEnabled = true;
                behavior.MetadataExporter.PolicyVersion = PolicyVersion.Policy15;
                host.Description.Behaviors.Add(behavior);

                // Open the ServiceHost to start listening for messages. Since
                // no endpoints are explicitly configured, the runtime will create
                // one endpoint per base address for each service contract implemented
                // by the service.
                host.Open();

                Console.WriteLine("The service is ready at {0}", baseAddress);
                Console.WriteLine("Press <Enter> to stop the service.");
                Console.ReadLine();

                // Close the ServiceHost.
                host.Close();
            }
        }
    }
}
