"use client";

import { Button } from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle, CardAction, CardDescription, CardFooter } from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {Tabs,TabsList,TabsTrigger,TabsContent} from "@/components/ui/tabs";
import{ Skeleton} from "@/components/ui/skeleton";
import{Checkbox}from "@/components/ui/checkbox";
import{Switch}from "@/components/ui/switch";
import{Separator}from "@/components/ui/separator";

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen p-8 max-w-4xl ml-12">
            <h1 className="text-4xl font-bold mb-8">
                問題選択
            </h1>
            <div>
                <h2 className="text-2xl font-bold mb-4">問題一覧</h2>
                <Tabs defaultValue="Q1">
                    <TabsList>
                        <TabsTrigger value="Q1">解剖学</TabsTrigger>
                        <TabsTrigger value="Q2">組織学</TabsTrigger>
                        <TabsTrigger value="Q3">生化学</TabsTrigger>
                        <TabsTrigger value="Q4">生理学</TabsTrigger>
                        <TabsTrigger value="Q5">口腔解剖学</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Q1">
                        <Card>
                            <CardHeader>
                                <CardTitle>解剖学</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">躯幹骨</Button>
                                    <Button variant="outline" size="sm">頭蓋骨</Button>
                                    <Button variant="outline" size="sm">筋肉</Button>
                                    <Button variant="outline" size="sm">神経</Button>
                                    <Button variant="outline" size="sm">血管</Button>
                                    <Button variant="outline" size="sm">臓器</Button>
                                    <Button variant="outline" size="sm">感覚器</Button>
                                    <Button variant="outline" size="sm">末梢神経</Button>
                                    <Button variant="outline" size="sm">中枢神経</Button>
                                    <Button variant="outline" size="sm">解剖実習</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">カスタム出題</Button>
                                    {/*<Switch id="Bone" />
                                    <label htmlFor="Bone" >躯幹骨</label>
                                    <Switch id="skull" />
                                    <label htmlFor="skull">頭蓋骨</label>
                                    <Switch id="Muscle" />
                                    <label htmlFor="Muscle">筋肉</label>
                                    <Switch id="Vessel" />
                                    <label htmlFor="Vessel">血管</label>
                                    <Switch id="Organ" />
                                    <label htmlFor="Organ">臓器</label>
                                    <Switch id="Sensory" />
                                    <label htmlFor="Sensory">感覚器</label>
                                    <Switch id="Peripheral" />
                                    <label htmlFor="Peripheral">末梢神経</label>
                                    <Switch id="Central" />
                                    <label htmlFor="Central">中枢神経</label>
                                    <Switch id="practice" />
                                    <label htmlFor="practice">解剖実習</label>*/}
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="Q2">
                        <Card>
                            <CardHeader>
                                <CardTitle>組織学</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">組織学</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="Q3">
                        <Card>
                            <CardHeader>
                                <CardTitle>生化学</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">試験1回目</Button>
                                    <Button variant="outline" size="sm">試験2回目</Button>
                                    <Button variant="outline" size="sm">試験3回目</Button>
                                    <Button variant="outline" size="sm">口腔生化学</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="Q4">
                        <Card>
                            <CardHeader>
                                <CardTitle>生理学</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">試験1回目</Button>
                                    <Button variant="outline" size="sm">試験2回目</Button>
                                    <Button variant="outline" size="sm">口腔生理学</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="Q5">
                        <Card>
                            <CardHeader>
                                <CardTitle>口腔解剖学</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">歯の解剖学</Button>
                                    <Button variant="outline" size="sm">一般組織発生</Button>
                                    <Button variant="outline" size="sm">口腔組織発生</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    {/*編集時は上を参考にして、これをコピーして編集してください
                    <TabsContent value="Qx">
                        <Card>
                            <CardHeader>
                                <CardTitle>title</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4">
                                    <Button variant="outline" size="sm">button</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">button</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>*/}
                </Tabs>
                <Separator />
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">前回までの結果一覧</h2>
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">解剖学</TabsTrigger>
                        <TabsTrigger value="tab2">組織学</TabsTrigger>
                        <TabsTrigger value="tab3">生化学</TabsTrigger>
                        <TabsTrigger value="tab4">生理学</TabsTrigger>
                        <TabsTrigger value="tab5">口腔解剖学</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                        <Card>
                            <CardHeader>
                                <CardTitle>解剖学</CardTitle>
                                <CardDescription>解剖学の問題に関する結果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">躯幹骨</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive" >リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">頭蓋骨</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">筋肉</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">脈管</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">内蔵</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">感覚器</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">末梢神経</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">中枢神経</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">解剖実習</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" size="sm">全て消去</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <Card>
                            <CardHeader>
                                <CardTitle>組織学</CardTitle>
                                <CardDescription>組織学の問題に関する結果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">組織学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" size="sm">全て消去</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tab3">
                        <Card>
                            <CardHeader>
                                <CardTitle>生化学</CardTitle>
                                <CardDescription>生化学の問題に関する結果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">生化学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" size="sm">全て消去</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tab4">
                        <Card>
                            <CardHeader>
                                <CardTitle>生理学</CardTitle>
                                <CardDescription>生理学の問題に関する結果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">生理学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive" size="sm">全て消去</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="tab5">
                        <Card>
                            <CardHeader>
                                <CardTitle>口腔組織学</CardTitle>
                                <CardDescription>口腔組織学の問題に関する結果</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">口腔組織学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">歯の解剖学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardContent>
                                <h3 className="text-md font-bold mb-4">発生学</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Progress value={50} max={100} />
                                    <h4 className="text-sm font-bold mb-4">正答率：50%</h4>
                                    <Button variant="destructive">リセット</Button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="destructive">全て消去</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            <div className="flex flex-wrap gap-4">
                <Button variant="destructive" size="sm">すべての結果を初期化する</Button>
            </div>
        </div>
    );
}
