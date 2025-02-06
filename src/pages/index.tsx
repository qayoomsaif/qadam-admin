import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Index() {
  const { push } = useRouter();

  useEffect(() => {
    push("/home");
  }, []);
  return <></>;
}
