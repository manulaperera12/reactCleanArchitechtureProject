import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

/**
 * Utility class for checking network connectivity
 */
export class NetworkInfo {
  /**
   * Check if the device is currently connected to the internet
   * @returns Promise resolving to a boolean indicating connection status
   */
  static async isConnected(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return !!state.isConnected && !!state.isInternetReachable;
  }

  /**
   * Get detailed network state information
   * @returns Promise resolving to the current NetInfoState
   */
  static async getNetworkState(): Promise<NetInfoState> {
    return await NetInfo.fetch();
  }

  /**
   * Subscribe to network changes
   * @param listener Callback function that receives network state updates
   * @returns Unsubscribe function
   */
  static addNetworkChangeListener(listener: (state: NetInfoState) => void): () => void {
    return NetInfo.addEventListener(listener);
  }

  /**
   * Execute a function with network connectivity check
   * @param onlineCallback Function to execute when online
   * @param offlineCallback Function to execute when offline
   * @returns Promise resolving to the result of the executed callback
   */
  static async executeWithConnectivityCheck<T>(
    onlineCallback: () => Promise<T>,
    offlineCallback: () => Promise<T>
  ): Promise<T> {
    const isConnected = await this.isConnected();
    return isConnected ? onlineCallback() : offlineCallback();
  }
}