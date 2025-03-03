import HomeButton from "@/components/HomeButton";
import Layout from "@/components/Layout";
import dynamic from "next/dynamic";

const BankList = dynamic(() => import("@/components/BankList"), {
  ssr: false,
});

export default function Home() {
  return (
    <Layout title="Blanked | Question Banks">
      <HomeButton />
      <BankList />
    </Layout>
  );
}
