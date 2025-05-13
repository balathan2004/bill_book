import { docInterface, ResponseConfig } from "@/components/utils/interfaces";
import { firestore } from "@/config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseConfig>
) {
  const data = req.body;

  if (!data.uid || data.doc_id) {
    try {
      const docRef = doc(firestore, "docs", data.uid);
      const docData = await getDoc(docRef);

      const dataFetched = docData.data()?.data as docInterface[];
      const filtered = dataFetched.filter((ele) => ele.doc_id != data.doc_id);

      await updateDoc(docRef, {
        data: filtered,
      });

      res.json({ message: "doc deleted", status: 200 });
    } catch (err) {
      console.log(err);
      res.json({ message: "error deleting doc", status: 300 });
    }
  }
}
