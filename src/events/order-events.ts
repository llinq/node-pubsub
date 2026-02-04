/**
 * Supported queue names for order-related events.
 */
type OrderQueueName = 'order.created' | 'order.updated' | 'order.cancelled';

/**
 * Base interface for all order-related events.
 * Defines the common structure for order event payloads.
 */
export interface OrderEvent {
  /** Unique identifier for the order */
  orderId: string;
  /** Total monetary value of the order */
  total: number;
  /** ID of the user who placed the order (optional) */
  userId?: string;
  /** Time when the event occurred */
  timestamp: Date;
}
