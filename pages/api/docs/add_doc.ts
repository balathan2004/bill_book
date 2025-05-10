import { firestore } from "@/components/utils/config";
import { docInterface, ResponseConfig } from "@/components/utils/interfaces";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (
  req: NextApiRequest,
  res: NextApiResponse<ResponseConfig>
) {
  const data = req.body as docInterface;

  console.log(data);

  const { uid, doc_id } = data;

  if (!uid || !doc_id) {
    res.json({ message: "fields missing", status: 300 });
    return;
  }

  const docRef = doc(firestore, "/docs", uid);

  const docFetch = await getDoc(docRef);

  if (!docFetch.exists()) {
    await setDoc(docRef, { data: [data] });
    res.json({ message: "doc created", status: 200 });
    return;
  }

  const allData = docFetch.data()?.data as docInterface[];

  const filterData = allData.filter((item) => item.doc_id != doc_id);

  await updateDoc(docRef, {
    data: [...filterData, data],
  });
  res.json({ message: "doc created", status: 200 });
}
