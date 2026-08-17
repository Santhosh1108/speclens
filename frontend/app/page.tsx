"use client";

import { useState } from "react";

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

  async function handleDiscover() {
    if (!message.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await discover(message, productState);
      setReply(result.reply);
      setProductState(result.product_state);
      setMessage("");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Discovery failed.");
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
      setPrd(result.prd);
      setExpandedProductState(result.product_state || productState);
      setStep("prd");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "PRD generation failed.");
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
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "PRD critique failed.");
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
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Prototype generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadDocx() {
    if (!expandedProductState) return;

    try {
      await exportPRDDocx(expandedProductState, !!critique);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Word export failed.");
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
          <Hero
            message={message}
            setMessage={setMessage}
            loading={loading}
            onSubmit={handleDiscover}
          />
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
            }}
          >
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
