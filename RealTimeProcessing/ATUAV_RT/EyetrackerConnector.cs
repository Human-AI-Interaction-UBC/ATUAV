using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tobii.Eyetracking.Sdk;
using Tobii.Eyetracking.Sdk.Exceptions;

namespace ATUAV_RT
{
    /// <summary>
    /// Connects to an eyetracker. Use a new EyetrackerConnector for each eyetracker connection.
    /// 
    /// Gaze data and frame rate change events can be subscribed to through
    /// the Eyetracker property.
    /// </summary>
    class EyetrackerConnector
    {
        private EyetrackerInfo info;
        private IEyetracker eyetracker;
        
        public EyetrackerConnector(EyetrackerInfo info)
        {
            this.Info = info;
        }

        /// <summary>
        /// Connected eyetracker information.
        /// Can only be updated with EyetrackerInfo with same ProductId.
        /// </summary>
        public EyetrackerInfo Info
        {
            get
            {
                return info;
            }

            set
            {
                if (info != null && info.ProductId != value.ProductId)
                {
                    throw new ArgumentException("EyetrackerConnector is already connected to a different eyetracker (" + info.ProductId + "). Create new EyetrackerConnector for " + value.ProductId + ".");
                }

                info = value;
            }
        }

        /// <summary>
        /// Connected Eyetracker, use for subscribing to events.
        /// </summary>
        public IEyetracker Eyetracker
        {
            get
            {
                return eyetracker;
            }
        }

        /// <summary>
        /// True if connector is connected to an eyetracker. (Not threadsafe).
        /// </summary>
        public bool Connected
        {
            get
            {
                return eyetracker != null;
            }
        }

        /// <summary>
        /// Connects to eyetracker and subscribes to events. Events are received on background thread.
        /// </summary>
        public void Connect()
        {
            try
            {
                eyetracker = EyetrackerFactory.CreateEyetracker(info, EventThreadingOptions.BackgroundThread);
                eyetracker.ConnectionError += ConnectionError;
                eyetracker.StartTracking();
            }
            catch (EyetrackerException ee)
            {
                Disconnect();
                if (ee.ErrorCode == 0x20000402)
                {
                    throw new Exception("Failed to upgrade protocol. Upgrade firmware to version 2.0.0 or higher.", ee);
                }

                throw ee;
            }
            catch (Exception e)
            {
                Disconnect();
                throw e;
            }
        }

        /// <summary>
        /// Unsubscribes from events and disconnects eyetracker.
        /// </summary>
        public void Disconnect()
        {
            if (eyetracker != null)
            {
                eyetracker.ConnectionError -= ConnectionError;
                eyetracker.Dispose();
                eyetracker = null;
                info = null;
            }
        }

        /// <summary>
        /// Disconnects from eyetracker on error.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e">Contains error code</param>
        private void ConnectionError(object sender, ConnectionErrorEventArgs e)
        {
            Console.WriteLine("Error: " + EyetrackerErrors.getDescription(e.ErrorCode));
            Console.WriteLine("Disconnecting from " + info.ProductId);
            Disconnect();
        }
    }
}
