
namespace ATUAV_RT
{
    /// <summary>
    /// Utility class for dealing with eyetracker errors.
    /// </summary>
    public static class EyetrackerErrors
    {
        /// <summary>
        /// Converts an eyetracker error code into a human readable description.
        /// </summary>
        /// <param name="errorCode">Eyetracker error code</param>
        /// <returns>String description of a eyetracker error</returns>
        public static string getDescription(int errorCode)
        {
            switch (errorCode)
            {
                case 0:
                    return "TOBII_SDK_ERROR_SUCCESS";
                case 1:
                    return "TOBII_SDK_ERROR_GENERIC";
                case 2:
                    return "TOBII_SDK_ERROR_INVALID_ARGUMENTS";
                case 3:
                    return "TOBII_SDK_ERROR_OUT_OF_MEMORY";
                case 4:
                    return "TOBII_SDK_ERROR_OUT_OF_RANGE";
                case 5:
                    return "TOBII_SDK_ERROR_NOT_INITIALIZED";
                case 6:
                    return "TOBII_SDK_ERROR_NOT_SUPPORTED";
                case 7:
                    return "TOBII_SDK_ERROR_INVALID_PAYLOAD_ITEM_TYPE";
                case 8:
                    return "TOBII_SDK_ERROR_TRANSPORT_ERROR";
                case 9:
                    return "TOBII_SDK_ERROR_UNKNOWN_OPCODE";
                case 10:
                    return "TOBII_SDK_ERROR_INVALID_PAYLOAD";
                case 11:
                    return "TOBII_SDK_ERROR_UNEXPECTED_PAYLOAD";
                case 12:
                    return "TOBII_SDK_ERROR_EMPTY_PAYLOAD";
                case 20:
                    return "TOBII_SDK_ERROR_INVALID_FACTORYINFO";
                case 30:
                    return "TOBII_SDK_ERROR_TIMEOUT";
                case 32:
                    return "TOBII_SDK_ERROR_OPERATION_ABORTED";
                case 40:
                    return "TOBII_SDK_ERROR_UPGRADE_GENERIC";
                case 41:
                    return "TOBII_SDK_ERROR_UPGRADE_SESSION_MISMATCH";
                case 42:
                    return "TOBII_SDK_ERROR_UPGRADE_MISSING_PART_ID";
                case 43:
                    return "TOBII_SDK_ERROR_UPGRADE_PACKAGE_VALIDATION";
                case 44:
                    return "TOBII_SDK_ERROR_UPGRADE_WRONG_MODEL";
                case 45:
                    return "TOBII_SDK_ERROR_UPGRADE_WRONG_GENERATION";
                case 46:
                    return "TOBII_SDK_ERROR_UPGRADE_CANT_DOWNGRADE";
                case 47:
                    return "TOBII_SDK_ERROR_UPGRADE_DEVICE_DATA_MISSING";
                case 0x20000500:
                    return "TOBII_FW_ERROR_UNKNOWN_OPERATION";
                case 0x20000501:
                    return "TOBII_FW_ERROR_UNSUPPORTED_OPERATION";
                case 0x20000502:
                    return "TOBII_FW_ERROR_OPERATION_FAILED";
                case 0x20000503:
                    return "TOBII_FW_ERROR_INVALID_PAYLOAD";
                case 0x20000504:
                    return "TOBII_FW_ERROR_UNKNOWN_ID";
                case 0x20000505:
                    return "TOBII_FW_ERROR_UNAUTHORIZED";
                case 0x20000507:
                    return "TOBII_FW_ERROR_INTERNAL_ERROR";
                case 0x20000508:
                    return "TOBII_FW_ERROR_STATE_ERROR";
                case 0x20000509:
                    return "TOBII_FW_ERROR_INVALID_PARAMETER";
                case 0x20000510:
                    return "TOBII_FW_ERROR_OPERATION_ABORTED";
                default:
                    return "unknown error " + errorCode;
            }
        }
    }
}
