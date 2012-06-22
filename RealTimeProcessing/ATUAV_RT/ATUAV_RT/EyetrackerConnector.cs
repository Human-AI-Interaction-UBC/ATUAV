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
    /// GazeData and Framerate change events should be subscribed to through
    /// the AddGazeDataHandler(1) and AddFramerateChangedHandler(1) methods which check if eyetracker is 
    /// connected yet and will delay connection if it isn't.
    /// </summary>
    class EyetrackerConnector
    {
        private EyetrackerInfo info;
        private IEyetracker eyetracker;
        private List<EventHandler<FramerateChangedEventArgs>> framerateChangedHandlers = new List<EventHandler<FramerateChangedEventArgs>>();
        private List<EventHandler<GazeDataEventArgs>> gazeDataHandlers = new List<EventHandler<GazeDataEventArgs>>();
        
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

                // subscribe to eyetracker events
                eyetracker.ConnectionError += ConnectionError;
                foreach (EventHandler<FramerateChangedEventArgs> handler in framerateChangedHandlers)
                {
                    eyetracker.FramerateChanged += handler;
                }
                foreach (EventHandler<GazeDataEventArgs> handler in gazeDataHandlers)
                {
                    eyetracker.GazeDataReceived += handler;
                }

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
                foreach (EventHandler<FramerateChangedEventArgs> handler in framerateChangedHandlers)
                {
                    eyetracker.FramerateChanged -= handler;
                }
                foreach (EventHandler<GazeDataEventArgs> handler in gazeDataHandlers)
                {
                    eyetracker.GazeDataReceived -= handler;
                }
                
                eyetracker.Dispose();
                eyetracker = null;
                info = null;
            }
        }

        /// <summary>
        /// Disconnects from eyetracker on error.
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ConnectionError(object sender, ConnectionErrorEventArgs e)
        {
            Console.WriteLine("Error: " + EyetrackerErrors.getDescription(e.ErrorCode));
            Console.WriteLine("Disconnecting from " + info.ProductId);
            Disconnect();
        }

        /// <summary>
        /// Adds a gaze data event handler to connected eyetracker. If eyetracker is not connected,
        /// subscription is delayed until eyetracker is connected. Method returns immediately.
        /// </summary>
        /// <param name="handler"></param>
        public void AddGazeDataHandler(EventHandler<GazeDataEventArgs> handler)
        {
            gazeDataHandlers.Add(handler);
            if (eyetracker != null)
            {
                eyetracker.GazeDataReceived += handler;
            }
        }

        /// <summary>
        /// Removes a gaze data event handler from connected eyetracker.
        /// </summary>
        /// <param name="handler"></param>
        public void RemoveGazeDataHandler(EventHandler<GazeDataEventArgs> handler)
        {
            gazeDataHandlers.Remove(handler);
            if (eyetracker != null)
            {
                eyetracker.GazeDataReceived -= handler;
            }
        }

        /// <summary>
        /// Adds a frame rate changed event handler to connected eyetracker. If eyetracker is not connected
        /// subscription is delayed until eyetracker is connected. Method returns immediately.
        /// </summary>
        /// <param name="handler"></param>
        public void AddFrameRateChangedHandler(EventHandler<FramerateChangedEventArgs> handler)
        {
            framerateChangedHandlers.Add(handler);
            if (eyetracker != null)
            {
                eyetracker.FramerateChanged += handler;
            }
        }

        /// <summary>
        /// Removes a frame rate changed event handler from connected eyetracker.
        /// </summary>
        /// <param name="handler"></param>
        public void RemoveFrameRateChangedHandler(EventHandler<FramerateChangedEventArgs> handler)
        {
            framerateChangedHandlers.Remove(handler);
            if (eyetracker != null)
            {
                eyetracker.FramerateChanged -= handler;
            }
        }
    }
}
