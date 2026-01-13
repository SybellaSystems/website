import getClientPromise  from "../mongodb";
import { sendEmail } from '@/lib/email'
import  { NewsletterSubscribe , ReplyData} from '../../types/index'
import logger from "../logger";
import { ObjectId } from "mongodb";

export async function addSubscriber(subscriber: NewsletterSubscribe) {
    const client = await getClientPromise();
    const db = client.db('newsletterDB')
    const collecion = db.collection<NewsletterSubscribe>("subscribers");

    // to check if email is already subscribed
    const existing = await collecion.findOne({ email: subscriber.email });
    if (existing) {
        logger.info("You have already subscribed !", { email: existing.email });
    }

    const res = await collecion.insertOne(subscriber)
    return res;

}

export async function getAllSubscribers() {
  try {
    const client = await getClientPromise();
    const db = client.db('newsletterDB');
    const subscribers = await db
      .collection<NewsletterSubscribe>("subscribers")
      .find({})
      .toArray();

    if (subscribers.length === 0) {
      logger.warn("No subscribers found");
    }

    return subscribers;
  } catch (error) {
    logger.error("Failed to fetch subscribers", { error });
    return [];
  }
}


export async function deleteSubscriber(id: string) {
  try {
    const client = await getClientPromise();
    const db = client.db('newsletterDB');
    const subscriber = await db.collection("subscribers").findOne({ _id: new ObjectId(id) });
    if (!subscriber) {
      throw new Error ("User Not Found");
    }
    await db.collection("subscribers").deleteOne({ _id: new ObjectId(id) });
    return { success: true, message: "Subscriber deleted successfully" }
  } catch(err) {
    console.error("Error deleting the user", err);
    throw new Error("Internal Server Error");
  }
}



export async function replyToSubscriber({ id, subject, message }: ReplyData) {
  try {
    const client = await getClientPromise();
    const db = client.db();

    const subscriber = await db.collection("subscribers").findOne({ _id: new ObjectId(id) });

    if (!subscriber) {
      return { success: false, message: "Subscriber not found" };
    }

    const emailResult = await sendEmail({
      receiver: subscriber.email,
      subject,
      message,
      name: "Sybella Support Team",
      company: "Sybella Systems",
      phone: "+254 715 410 009",
    });

    if (!emailResult.success) {
      return { success: false, message: "Failed to send email" };
    }

    await db.collection("subscriber_replies").insertOne({
      subscriberId: id,
      email: subscriber.email,
      subject,
      message,
      sentAt: new Date(),
    });

    return { success: true, message: "Reply sent successfully" };
  } catch (error) {
    console.error("replyToSubscriber error:", error);
    return { success: false, message: "Internal server error" };
  }
}