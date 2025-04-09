interface ExpenseMessage {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  userId: string;
}

export async function processMessage(messageContent: string): Promise<void> {
  try {
    const message: ExpenseMessage = JSON.parse(messageContent);

    // TODO: Add your message processing logic here
    // For example:
    // - Validate the message
    // - Store in database
    // - Send notifications
    // - Update statistics

    console.log("Processing expense:", {
      id: message.id,
      amount: message.amount,
      description: message.description,
      date: message.date,
      category: message.category,
      userId: message.userId,
    });
  } catch (error) {
    console.error("Error processing message:", error);
    throw error;
  }
}
