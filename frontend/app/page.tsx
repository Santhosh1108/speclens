"use client";

import { useState, useEffect } from "react";

import posthog from "posthog-js";

import {
  discover,
  generatePRD,
  critiquePRD,
  generatePrototype,
  exportPRDDocx,
} from "../lib/api";

import Header from "../components/Header";
import Hero from "../components/Hero";
import DiscoveryPanel from "../components/DiscoveryPanel";
import CritiquePanel from "../components/CritiquePanel";
import PrototypePanel from "../components/PrototypePanel";
import PRDDocument from "../components/PRDDocument";
import { StepIndicator, lineStyle } from "../components/ui";

type Step = "discover" | "prd" | "critique" | "prototype";

const EXAMPLE_IDEAS = [
  "A mobile app that helps teams schedule meetings by understanding everyone's calendars",
  "A productivity tool that automatically transcribes and summarizes voice notes into actionable tasks",
  "A Chrome extension that finds the best time to post on social media based on audience engagement patterns",
];

export default function Home() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [productState, setProductState] = useState<any>(null);
  const [prd, setPrd] = useState("");
  const [expandedProductState, setExpandedProductState] = useState<any>(null);
  const [critique, setCritique] = useState<any>(null);
  const [prototype, setPrototype] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("discover");
  const [backendHealthy, setBackendHealthy] = useState<boolean | null>(null);

  // Check backend health on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://speclens-production.up.railway.app"}/health`,
          { method: "GET" }
        );
        setBackendHealthy(response.ok);
      } catch (err) {
        setBackendHealthy(false);
      }
    };
    checkBackend();
  }, []);

  function handleExampleClick(idea: string) {
    setMessage(idea);
  }

  async function handleDiscover() {
    if (!message.trim() || loading) return;

    setLoading(true);

if (!productState) {
  posthog.capture("idea_created");
}

setError("");

    try {
      const result = await discover(message, productState);
      setReply(result.reply);
      setProductState(result.product_state);
      setMessage("");
    } catch (error: any) {
      posthog.capture("discovery_failed");
      const errorMsg = error?.message || "Discovery failed.";
      
      // Provide helpful error messages
      let helpfulError = errorMsg;
      if (errorMsg.includes("Failed to fetch")) {
        helpfulError = "Backend is not responding. Check your internet connection or try again in a moment.";
      } else if (errorMsg.includes("Network")) {
        helpfulError = "Network error. Make sure the backend API is deployed and accessible.";
      }
      
      setError(helpfulError);
      console.error("Discovery error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePRD() {
    if (!productState || loading) return;

    setLoading(true);
    setError("");

    try {
  const result = await generatePRD(productState);
  posthog.capture("discovery_completed");
      setPrd(result.prd);
setExpandedProductState(result.product_state || productState);
setStep("prd");
posthog.capture("prd_completed");
    } catch (error: any) {
      posthog.capture("prd_generation_failed");
      setError(error instanceof Error ? error.message : "PRD generation failed. Please try again.");
      console.error("PRD generation error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCritique() {
    if (!productState || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await critiquePRD(productState);
      setCritique(result);
setStep("critique");
posthog.capture("critique_completed");
      
    } catch (error: any) {
      posthog.capture("critique_generation_failed");
      setError(error instanceof Error ? error.message : "PRD critique failed. Please try again.");
      console.error("Critique error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleGeneratePrototype() {
    if (!productState || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await generatePrototype(productState);
      setPrototype(result);
setStep("prototype");
posthog.capture("prototype_completed");
    } catch (error: any) {
      posthog.capture("prototype_generation_failed");
      setError(error instanceof Error ? error.message : "Prototype generation failed. Please try again.");
      console.error("Prototype error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadDocx() {
    if (!expandedProductState) return;

    try {
      await exportPRDDocx(expandedProductState, critique, !!critique);
      posthog.capture("docx_exported");
    } catch (error: any) {
      setError(error instanceof Error ? error.message : "Word export failed. Please try again.");
      console.error("Export error:", error);
    }
  }

  function resetProject() {
    setMessage("");
    setReply("");
    setProductState(null);
    setPrd("");
    setExpandedProductState(null);
    setCritique(null);
    setPrototype(null);
    setError("");
    setStep("discover");
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--paper)", color: "var(--ink)" }}>
      <Header onReset={resetProject} />

      {/* Backend Health Warning */}
      {backendHealthy === false && !productState && (
        <div
          style={{
            padding: "12px 16px",
            background: "var(--danger-soft)",
            color: "var(--danger)",
            textAlign: "center",
            fontSize: "13px",
            borderBottom: "1px solid var(--danger)",
          }}
        >
          ⚠️ Backend is not responding. Check your API URL in environment variables or try again later.
        </div>
      )}

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "38px 28px 70px" }}>
        {/* PROGRESS */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "42px",
          }}
        >
          <StepIndicator number="01" label="Discovery" active={step === "discover"} />
          <div style={lineStyle} />
          <StepIndicator
            number="02"
            label="PRD"
            active={step === "prd" || step === "critique"}
          />
          <div style={lineStyle} />
          <StepIndicator number="03" label="Prototype" active={step === "prototype"} />
        </div>

        {/* HERO */}
        {!productState && (
          <>
            <Hero
              message={message}
              setMessage={setMessage}
              loading={loading}
              onSubmit={handleDiscover}
            />

            {/* EXAMPLE IDEAS */}
            <div style={{ marginTop: "32px" }}>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
                💡 Try one of these ideas:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {EXAMPLE_IDEAS.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleExampleClick(idea)}
                    style={{
                      padding: "10px 14px",
                      border: "1px solid var(--border)",
                      background: "var(--paper)",
                      color: "var(--ink)",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontSize: "13px",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--paper-hover)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--paper)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                    }}
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DISCOVERY */}
        {productState && (
          <DiscoveryPanel
            reply={reply}
            message={message}
            setMessage={setMessage}
            loading={loading}
            productState={productState}
            onContinue={handleDiscover}
            onGeneratePRD={handleGeneratePRD}
            onCritique={handleCritique}
            onGeneratePrototype={handleGeneratePrototype}
            hasPrd={!!prd}
          />
        )}

        {/* PRD */}
        {prd && (
          <section style={{ marginTop: "38px" }}>
            <PRDDocument
              product={expandedProductState || productState}
              onDownloadDocx={handleDownloadDocx}
            />
          </section>
        )}

        {/* CRITIQUE */}
        {critique && <CritiquePanel critique={critique} />}

        {/* PROTOTYPE */}
        {prototype && <PrototypePanel prototype={prototype} />}

        {/* ERROR */}
        {error && (
          <div
            style={{
              marginTop: "25px",
              padding: "14px 16px",
              border: "1px solid #f0b7b7",
              background: "var(--danger-soft)",
              color: "var(--danger)",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              whiteSpace: "pre-wrap",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => {
                if (productState) {
                  handleDiscover();
                }
              }}
              style={{
                background: "var(--danger)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
