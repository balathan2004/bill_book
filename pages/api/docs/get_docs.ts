import { NextApiRequest, NextApiResponse } from "next";
import { getDoc, doc } from "firebase/firestore";
import { firestore } from "@/config";
import { docInterface, docResponseConfig } from "@/components/utils/interfaces";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<docResponseConfig>
) {
  const { uid } = req.body;

  if (!uid) {
    res.json({
      message: "not logged in",
      status: 300,
      docData: [],
    });
    return;
  }

  const docRef = doc(firestore, "/docs", uid);

  const docFetch = await getDoc(docRef);

  if (!docFetch.exists()) {
    res.json({
      message: "doc not found",
      status: 200,
      docData: [],
    });
    return;
  }

  const docData = docFetch.data().data as docInterface[];
  const sorted = [...docData].sort((a, b) => b.created_at - a.created_at);

  res.json({ message: "docs fetched", status: 200, docData: sorted });
  return;
}
