import Layout from "@/components/Layout";
import HomeHeader from "@/components/HomeHeader";
import HomeStats from "@/components/HomeStats";
import Computer from "./computer";

export default function Home() {
  return (
    <Layout>
      <HomeHeader />
      <Computer />
    </Layout>
  );
}
