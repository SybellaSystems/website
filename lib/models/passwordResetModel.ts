import  getClientPromise  from "../mongodb";

export async function saveResetToken(email: string, hashedToken: string, expiresAt: Date) {
  const client = await getClientPromise();
  const db = client.db();
  await db.collection("password_resets").updateOne(
    { email },
    { $set: { token: hashedToken, expiresAt } },
    { upsert: true }
  );
}

export async function findValidResetToken(email: string, hashedToken: string) {
  const client = await getClientPromise();
  const db = client.db();
  return await db.collection("password_resets").findOne({
    email,
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  });
}

export async function deleteResetToken(email: string) {
  const client = await getClientPromise();
  const db = client.db();
  await db.collection("password_resets").deleteOne({ email });
}
