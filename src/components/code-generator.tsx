"use client";

import { useEffect, useState, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateCode, type State } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  Terminal,
  Copy,
  Check,
  Play,
  Code,
  RefreshCw,
  ClipboardPaste,
  BrainCircuit,
  Sparkles,
  Download,
} from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const initialState: State = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground"
      size="lg"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Play className="mr-2" />
          Generate Code
        </>
      )}
    </Button>
  );
}

function CodeDisplay({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fileExtensionMap: { [key: string]: string } = {
      Python: "py",
      C: "c",
      "C++": "cpp",
      Java: "java",
    };
    const extension = fileExtensionMap[language] || "txt";
    const filename = `logic2code-gen.${extension}`;
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full">
      <Card className="bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="text-primary" />
            <CardTitle className="text-base font-medium">Generated Code</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">Copy code</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              <span className="sr-only">Download code</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-background p-4 rounded-md">
            <pre>
              <code className="font-code text-sm text-foreground">
                {code}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function CodeGenerator() {
  const [state, formAction] = useActionState(generateCode, initialState);
  const { toast } = useToast();
  const [showLogic, setShowLogic] = useState(false);
  const [language, setLanguage] = useState<string>("Python");
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state.fieldErrors?.language) {
      toast({
        title: "Error",
        description: state.fieldErrors.language.join(", "),
        variant: "destructive",
      });
    }
    if (state.fieldErrors?.question) {
      toast({
        title: "Error",
        description: state.fieldErrors.question.join(", "),
        variant: "destructive",
      });
    }
  }, [state, toast]);

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="relative">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-primary/20 p-2 rounded-md border border-primary/50">
            <Code size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Logic2Code</h1>
            <p className="text-muted-foreground">
              Empowering developers to think first, code second.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <Label
              htmlFor="custom-logic"
              className="text-xs text-muted-foreground font-bold"
            >
              CUSTOM LOGIC
            </Label>
            <Switch
              id="custom-logic"
              checked={showLogic}
              onCheckedChange={setShowLogic}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground font-bold">
              LANG:
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-32 bg-card border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="C++">C++</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </header>

      <form ref={formRef} action={formAction}>
        <input type="hidden" name="language" value={language} />

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-medium">
                  <ClipboardPaste className="text-primary" />
                  Problem Description
                </CardTitle>
                <CardDescription>
                  Paste the coding challenge or problem description here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="question"
                  name="question"
                  placeholder="e.g. Write a function that finds the longest palindromic substring in a given string..."
                  rows={5}
                  required
                  className="bg-input border-0 focus-visible:ring-primary"
                />
              </CardContent>
            </Card>

            {showLogic && (
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 font-medium">
                    <BrainCircuit className="text-primary" />
                    Logic Editor
                  </CardTitle>
                  <CardDescription>
                    Write your algorithm or pseudocode below.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="logic"
                    name="logic"
                    placeholder="1. Create a 2D array dp[n][n]... 2. Loop through the string... 3. Return the maximum..."
                    rows={5}
                    className="bg-input border-0 focus-visible:ring-primary"
                  />
                </CardContent>
              </Card>
            )}

            <SubmitButton />
          </div>

          <div className="space-y-4">
             <CardTitle className="flex items-center gap-3 font-medium">
                <Sparkles className="text-primary"/>
                Generated Solution
            </CardTitle>
            <div className="min-h-[60vh] flex items-center justify-center rounded-lg bg-card p-8">
              {pending && (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">Generating your code...</p>
                </div>
              )}

              {!pending && state.result && (
                <CodeDisplay
                  code={state.result.code}
                  language={language}
                />
              )}

              {!pending && !state.result && (
                <div className="text-center text-muted-foreground">
                  <Sparkles
                    size={48}
                    className="mx-auto mb-4 text-primary"
                  />
                  <p>
                    Complete the inputs and click "Generate Code" to see the
                    magic happen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
