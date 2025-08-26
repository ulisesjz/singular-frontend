"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReactMarkdown from "react-markdown";
import parse from 'html-react-parser';
import { Circle } from 'rc-progress';
import { ChevronDown } from 'lucide-react';
import prods from './prods.js';

type PageAnalysisResponse = {
  markup: string;
  performance: {
    analisys: string;
    metrics: {
      firstContentfulPaint: PerformanceMetric;
      maxPotentialFirstInputDelay: PerformanceMetric;
      cumulativeLayoutShift: PerformanceMetric;
    };
  };
};

type PerformanceMetric = {
  score: number;
  displayValue: string;
  numericValue: number;
};

const calculateColor = (score: number) => {
  if (score * 100 >= 90) {
    return '#00FF00';
  } else if (score * 100 >= 50) {
    return '#FFA500';
  } else {
    return '#FF0000';
  }
}

const isValidURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

export default function URLAnalysisPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressMessage, setProgressMessage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<PageAnalysisResponse | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    setError(isValidURL(newUrl) ? null : 'Por favor, ingresa una URL válida.');
  };

  const handleGenerateDescription = async (pageUrl: string) => {
    setLoading(true);
    setDescription('');
    setActiveTab('description');
    setProgressMessage('Generating tags and product description...');
    // const descriptionResponse = await fetch('http://localhost:3000/v1/scribe-ai/product-url-description', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     "model": "gpt-4o-2024-08-06",
    //     "systemRole": "You are a professional website auditor, specialized in identifying opportunities for improvement in SEO, performance, and content quality. Your goal is to analyze websites with a strategic approach, detecting optimization areas to enhance their visibility in search engines, user experience, and content effectiveness. You must provide recommendations based on best practices and analytical data, prioritizing high-impact actions to maximize positioning and conversion.",
    //     pageUrl,
    //     "lang": "EN",
    //     "titleSelector": "h1#main-title",
    //     "specsSelector": "#product-description-atf",
    //     "guidelines": "include at the end that at Walmart we have everything, that Walmart always has low prices, and that it is the No. 1 supermarket for Americans.",
    //     "fine-tuned-model": "ft:gpt-4o-2024-08-06:scribe-ai:scribeai-walmart:B1hZXw9k",
    //     "user": "wlmt-vt@walmart.com",
    //     "createdBy": "@walmart.com",
    //     "extractor": "puppeteer"
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });
    const descResp = await new Promise(r => setTimeout(r, 5700));

    const descriptionJSON = `
    <h1>RITZ Original Crackers – Family Size, 20.5 oz</h1>

    <h4><strong>About this item</strong></h4>
Indulge in the rich, buttery taste of RITZ Original Crackers, a timeless snack that's loved by kids and adults alike. With their light, flaky texture and savory flavor, these crackers are perfect for everything from everyday snacking to party platters and school lunches.

Imagine the convenience of having a crowd-pleasing snack that’s ready to enjoy anytime. Whether you top them with cheese, pair them with deli meats, or serve them alongside dips and spreads, RITZ crackers offer endless possibilities. You can even get creative with sweet combinations like fruit and whipped cream for a fun twist.

Each 20.5-ounce family-size box includes six individually wrapped sleeves to help maintain freshness and make on-the-go packing a breeze. With their satisfying crunch and versatile flavor, RITZ crackers are a pantry staple your whole family will love.

At Walmart, our mission is to create more moments of joy through delicious snacks made with care. RITZ crackers are just one of the many ways we help bring people together—one bite at a time.

<ul>
<li>Rich, buttery flavor and flaky texture</li>
<li>Perfect for snacking, entertaining, or school lunches</li>
<li>Pairs well with cheese, deli meats, dips, and spreads</li>
<li>Great for sweet or savory combinations</li>
<li>6 individually wrapped sleeves for freshness</li>
<li>20.5 oz family-size box (packaging may vary)</li>
<li>A classic snack from Mondelēz International</li>

<h3>Suggested Search Terms:</h3>
<ul>
<li>individual snacks</li>
<li>Ritz crackers</li>
<li>Ritz</li>
<li>cheese crackers</li>
<li>crackers</li>
<li>snack crackers</li>
<li>snack</li>
<li>snack food</li>
<li>snack pack</li>
<li>Fmily size</li>
<ul>
<br />
<button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">Publish for approval</button>
`
    setDescription(descriptionJSON);
    setLoading(false);
  };

  const handleAnalyzePage = async (pageUrl: string) => {
    setLoading(true);
    setAnalysis(null);
    setActiveTab('analysis');
    setProgressMessage('Analizando la página actual. Puede demorar unos minutos ...');
    const systemRole = "You are a professional website auditor, specialized in identifying opportunities for improvement in SEO, performance, and content quality. Your goal is to analyze websites with a strategic approach, detecting optimization areas to enhance their visibility in search engines, user experience, and content effectiveness. You must provide recommendations based on best practices and analytical data, prioritizing high-impact actions to maximize positioning and conversion.";
    const analysisResponse = await fetch('https://tiipe-server-y758q.ondigitalocean.app/v1/scribe-ai/page-audit', {
      method: 'POST',
      body: JSON.stringify({
        "model": "gpt-4o",
        "systemRole": systemRole,
        pageUrl,
        "lang": "EN",
        "htmlQuery": "body #__next"
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const analysisJSON = await analysisResponse.json();
    setAnalysis(analysisJSON);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-3/4">
        <Card className="lider-poc">
          <CardHeader>
            <CardTitle>
              <img
                alt="Walmart"
                className="rounded-md"
                width="40px"
                src="/assets/images/lider_logo.png"
                style={{ display: "inline-block" }}
              />
              <span style={{ display: "inline-block" }}>Content Optimization Agent</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input
                type="url"
                placeholder="Introduce URL"
                value={url}
                onChange={handleUrlChange}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex space-x-4">
                <Button onClick={() => handleGenerateDescription(url)} disabled={loading || !!error || !url}>
                  Generate Description
                </Button>
                <Button onClick={() => handleAnalyzePage(url)} disabled={loading || !!error || !url}>
                  Audit Page
                </Button>
                <div className='pl-[400px] flex flex-row'>
                  <div className="select-input">
                    <label className="ml-1 text-xs absolute">Lang</label>
                    <select className="mt-4 text-[14px]">
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div className="select-input ml-3">
                    <label className="ml-1 text-xs absolute">Model</label>
                    <select className="mt-4 text-[14px]">
                      <option value="en">Vilo-Walmart - OAI4o</option>
                      <option value="es">OAI4o</option>
                      <option value="fr">OAI3.5T</option>
                    </select>
                  </div>
                </div>
              </div>
              {loading && (
                <div className="relative w-100 h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="absolute top-0 left-0 w-1/4 h-full bg-blue-500 animate-[bounce_0.8s_infinite_alternate]" style={{ animation: 'bounce 0.8s infinite alternate' }}></div>
                  <style jsx>{`
                @keyframes bounce {
                  0% { left: 0%; }
                  100% { left: 75%; }
                }
              `}</style>
                </div>
              )}
              {loading && <p className="text-center text-gray-500">{progressMessage}</p>}
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="description-html">
                {description ? parse(description) : 'Here you will find the product description.'}
                <br />
                <br />
                <hr />
                <br />
              </TabsContent>
              <TabsContent value="analysis" className="description-html">
                <>
                  {
                    analysis?.performance?.metrics && (
                      <>
                        <h1>Performance score</h1>
                        <div className="flex justify-between mb-5">
                          <div className="flex flex-col items-center">
                            {
                              ((firstContentfulPaint) =>
                                <>
                                  <Circle style={{ width: "50px", display: "inline-block" }} percent={firstContentfulPaint.score * 100} strokeWidth={9} trailWidth={9} trailColor="#DDDDDD" strokeColor={calculateColor(firstContentfulPaint.score)} />
                                  {firstContentfulPaint.score * 100} / 100
                                </>)(analysis.performance.metrics.firstContentfulPaint)
                            }
                            <p><small>First Contentful Paint</small></p>
                          </div>
                          <div className='flex flex-col items-center'>
                            {
                              ((cumulativeLayoutShift) =>
                                <>
                                  <Circle style={{ width: "50px", display: "inline-block" }} percent={cumulativeLayoutShift.score * 100} strokeWidth={9} trailWidth={9} trailColor="#DDDDDD" strokeColor={calculateColor(cumulativeLayoutShift.score)} />
                                  <p>{cumulativeLayoutShift.score * 100} / 100</p>
                                </>)(analysis.performance.metrics.cumulativeLayoutShift)
                            }
                            <p><small>Cumulative Layout Shift</small></p>
                          </div>
                          <div className='flex flex-col items-center'>
                            {
                              ((maxPotentialFirstInputDelay) =>
                                <>
                                  <Circle style={{ width: "50px", display: "inline-block" }} percent={maxPotentialFirstInputDelay.score * 100} strokeWidth={9} trailWidth={9} strokeColor={calculateColor(maxPotentialFirstInputDelay.score)} />
                                  {maxPotentialFirstInputDelay.score * 100} / 100
                                </>)(analysis.performance.metrics.maxPotentialFirstInputDelay)
                            }
                            <p><small>Max Potential First Input Delay</small></p>
                          </div>
                          <br />
                        </div>
                      </>
                    )
                  }
                  <div className="description-html">
                    <ReactMarkdown>{analysis?.performance?.analisys || 'Here you will find the page analysis'}</ReactMarkdown>
                    <br />
                    <hr />
                    <br />
                    <ReactMarkdown>{analysis?.markup}</ReactMarkdown>
                  </div>
                </>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="w-3/4 mt-6">
        <Card className="lider-poc">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            {prods.map((prod, index) => (
              <div key={index} className="border rounded-md p-4 mb-2">
                <div onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}>
                  <h3 className="text-lg font-bold">{prod.title}</h3>
                  <div className="flex items-stretch justify-between">
                    <a href={prod.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 mr-4">{prod.url}</a>
                    <ChevronDown className={`cursor-pointer transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                {expandedIndex === index && (
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="description-html">
                      <div className="description-html">{parse(prod.description)}</div>
                    </TabsContent>
                    {/* <TabsContent value="analysis" className="description-html">
                      <div className="flex justify-around mb-5 mt-5">
                        {prod.analysis?.performance?.metrics && Object.entries(prod.analysis.performance.metrics).map(([key, metric]) => (
                          <div key={key} className="flex flex-col items-center">
                            <Circle style={{ width: "50px", display: "inline-block" }} percent={metric.score * 100} strokeWidth={9} trailWidth={9} trailColor="#DDDDDD" strokeColor={calculateColor(metric.score)} />
                            <p>{metric.score * 100} / 100</p>
                            <p><small>{key.replace(/([A-Z])/g, ' $1')}</small></p>
                          </div>
                        ))}
                      </div>
                      <ReactMarkdown>{prod.analysis?.performance?.analisys || 'No hay análisis disponible.'}</ReactMarkdown>
                      <br />
                      <hr />
                      <br />
                      <ReactMarkdown>{prod.analysis?.markup || 'No hay contenido de auditoría disponible.'}</ReactMarkdown>
                    </TabsContent> */}
                  </Tabs>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
