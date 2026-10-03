import HomeSections from "@/components/HomeSections";
import Footer from "@/components/Footer";
import JittokStructuredData from "@/components/JittokStructuredData";
import { type HomeContent } from "@/lib/contentService";
import { getServerHome } from "@/lib/serverCatalog";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { content, renderedAt } = await getServerHome();
  const serializable = JSON.parse(JSON.stringify(content)) as HomeContent;
  return <><main><JittokStructuredData content={content} /><HomeSections content={serializable} now={renderedAt} /></main><Footer /></>;
}
