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
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">
                実験用
            </h1>
            <div>
                <h1 className="flex flex-wrap gap-4 mb-8">
                    <Button variant="default">default</Button>
                </h1>
            </div>
            <div className="flex flex-wrap gap-4 mb-8">
                <Button variant="default">default</Button>
                <Button variant="destructive">destructive</Button>
                <Button variant="outline">outline</Button>
                <Button variant="secondary">secondary</Button>
                <Button variant="ghost">ghost</Button>
                <Button variant="link">link</Button>
            </div>

            <div className="flex items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
                <div className="flex flex-wrap gap-4">
                    <Button variant="destructive" size="sm">全データ削除</Button>
                    <Button className="w-full" size="sm">キャンセル</Button>
                    <Button className="w-full" size="sm" disabled>キャンセル</Button>
                </div>
            </div>

            <div className="max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>This is the content of the card.</p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button variant="default">Save</Button>
                    </CardFooter>
                </Card>
            </div>
            
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Badges</h2>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Inputs</h2>
                <div className="flex flex-wrap gap-4">
                    <Input type="email" placeholder="Email" />
                    <Input type="text" placeholder="Username" />
                    <Input type="password" placeholder="Password" />
                    <Input type="number" placeholder="Age" />
                    <Input type="text" disabled placeholder="Address" />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Progress</h2>
                <div className="flex flex-wrap gap-4">
                    <Progress value={50} max={100} />
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Tabs</h2>
                <Tabs defaultValue="tab1">
                    <TabsList>
                        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tab1">
                        <p>This is the content of Tab 1.</p>
                    </TabsContent>
                    <TabsContent value="tab2">
                        <p>This is the content of Tab 2.</p>
                    </TabsContent>
                    <TabsContent value="tab3">
                        <p>This is the content of Tab 3.</p>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="space-y-2" >
                <Skeleton className="h-4 w-48" />
            </div>

            <Card className="max-w-sm">
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                    <CardDescription>Please wait while we load the content.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-4 w-48" />
                </CardContent>
            </Card>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Checkbox id="anatomy" />
                    <label htmlFor="anatomy">Anatomy</label>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Switch id="Shuffle" />
                <label htmlFor="Shuffle">Shuffle</label>
            </div>

            <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4">Separator</h2>
                <p className="mb-4">This is some content above the separator.</p>
                <Separator className="my-4" />

                <h3 className="text-xl font-semibold mb-2">Section Title</h3>
                <p>This is some content below the separator.</p>
                <Separator className="my-4" />

                <h3 className="text-xl font-semibold mb-2">Another Section</h3>
                <p>This is some content below the separator.</p>
            </div>
        </div>
    );
}
