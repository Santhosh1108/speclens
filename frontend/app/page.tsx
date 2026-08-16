"use client";

import { useState } from "react";

import {
  discover,
  generatePRD,
  critiquePRD,
  generatePrototype,
} from "../lib/api";


type Step =
  | "discover"
  | "prd"
  | "critique"
  | "prototype";


export default function Home() {

  const [message, setMessage] = useState("");

  const [reply, setReply] = useState("");

  const [productState, setProductState] =
    useState<any>(null);

  const [prd, setPrd] = useState("");

  const [critique, setCritique] =
    useState<any>(null);

  const [prototype, setPrototype] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [step, setStep] =
    useState<Step>("discover");


  async function handleDiscover() {

    if (!message.trim() || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result = await discover(
        message,
        productState
      );

      setReply(result.reply);
      setProductState(
        result.product_state
      );

      setMessage("");

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Discovery failed."
      );

    } finally {

      setLoading(false);
    }
  }


  async function handleGeneratePRD() {

    if (!productState || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result =
        await generatePRD(productState);

      setPrd(result.prd);

      setStep("prd");

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "PRD generation failed."
      );

    } finally {

      setLoading(false);
    }
  }


  async function handleCritique() {

    if (!productState || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result =
        await critiquePRD(
          productState
        );

      setCritique(result);

      setStep("critique");

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "PRD critique failed."
      );

    } finally {

      setLoading(false);
    }
  }


  async function handleGeneratePrototype() {

    if (!productState || loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {

      const result =
        await generatePrototype(
          productState
        );

      setPrototype(result);

      setStep("prototype");

    } catch (error) {

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Prototype generation failed."
      );

    } finally {

      setLoading(false);
    }
  }


  function resetProject() {

    setMessage("");
    setReply("");
    setProductState(null);
    setPrd("");
    setCritique(null);
    setPrototype(null);
    setError("");
    setStep("discover");

  }


  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7f5",
        color: "#171717",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      }}
    >

      {/* HEADER */}

      <header
        style={{
          height: "72px",
          borderBottom:
            "1px solid #e5e5e5",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 42px",
        }}
      >

        <div>

          <div
            style={{
              fontSize: "20px",
              fontWeight: 750,
              letterSpacing: "-0.5px",
            }}
          >
            SpecLens
          </div>

          <div
            style={{
              fontSize: "11px",
              color: "#777",
              marginTop: "2px",
            }}
          >
            Idea → PRD → MVP
          </div>

        </div>


        <button
          onClick={resetProject}
          style={{
            border:
              "1px solid #d9d9d9",
            background: "#fff",
            borderRadius: "8px",
            padding: "9px 14px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          New Product
        </button>

      </header>


      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "38px 28px 70px",
        }}
      >

        {/* PROGRESS */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "42px",
            fontSize: "12px",
            color: "#777",
          }}
        >

          <StepIndicator
            number="01"
            label="Discovery"
            active={step === "discover"}
          />

          <div style={lineStyle} />

          <StepIndicator
            number="02"
            label="PRD"
            active={
              step === "prd" ||
              step === "critique"
            }
          />

          <div style={lineStyle} />

          <StepIndicator
            number="03"
            label="Prototype"
            active={
              step === "prototype"
            }
          />

        </div>


        {/* HERO */}

        {!productState && (

          <section
            style={{
              maxWidth: "850px",
              margin:
                "70px auto 0",
              textAlign: "center",
            }}
          >

            <div
              style={{
                display:
                  "inline-block",
                background: "#ececec",
                borderRadius: "999px",
                padding:
                  "6px 11px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.6px",
                marginBottom: "18px",
              }}
            >
              AI PRODUCT BUILDER
            </div>


            <h1
              style={{
                fontSize:
                  "clamp(38px, 6vw, 68px)",
                lineHeight: 1.02,
                letterSpacing:
                  "-3px",
                margin:
                  "0 0 20px",
                fontWeight: 800,
              }}
            >
              Turn an idea into
              <br />
              a product.
            </h1>


            <p
              style={{
                fontSize: "17px",
                color: "#666",
                lineHeight: 1.6,
                maxWidth: "650px",
                margin:
                  "0 auto 34px",
              }}
            >
              Describe what you want to
              build. SpecLens helps you
              discover the problem, structure
              the requirements, generate a PRD,
              critique it, and turn it into an
              MVP prototype.
            </p>


            <div
              style={{
                background: "#fff",
                border:
                  "1px solid #dedede",
                borderRadius: "14px",
                padding: "14px",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.05)",
              }}
            >

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder={
                  "What do you want to build?\n\nExample: I want to build a marketplace where students can find local tutors."
                }
                rows={5}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  padding: "10px",
                  boxSizing:
                    "border-box",
                  fontFamily:
                    "inherit",
                }}
              />


              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  borderTop:
                    "1px solid #eee",
                  paddingTop: "12px",
                }}
              >

                <span
                  style={{
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  SpecLens will ask
                  focused questions.
                </span>


                <button
                  onClick={
                    handleDiscover
                  }
                  disabled={
                    loading ||
                    !message.trim()
                  }
                  style={{
                    background:
                      "#171717",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding:
                      "11px 19px",
                    fontWeight: 650,
                    cursor:
                      loading
                        ? "wait"
                        : "pointer",
                  }}
                >
                  {loading
                    ? "Thinking..."
                    : "Start Discovery →"}
                </button>

              </div>

            </div>

          </section>

        )}


        {/* DISCOVERY */}

        {productState && (

          <section>

            <div
              style={{
                marginBottom: "26px",
              }}
            >

              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 750,
                  letterSpacing:
                    "1px",
                  color: "#777",
                  marginBottom:
                    "8px",
                }}
              >
                PRODUCT DISCOVERY
              </div>

              <h1
                style={{
                  fontSize: "34px",
                  letterSpacing:
                    "-1.5px",
                  margin: 0,
                }}
              >
                Shape the product.
              </h1>

            </div>


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(0, 1fr) 350px",
                gap: "22px",
                alignItems:
                  "start",
              }}
            >

              {/* CHAT */}

              <div
                style={{
                  background:
                    "#fff",
                  border:
                    "1px solid #e1e1e1",
                  borderRadius:
                    "14px",
                  padding: "24px",
                }}
              >

                <div
                  style={{
                    fontSize: "12px",
                    color: "#888",
                    marginBottom:
                      "10px",
                  }}
                >
                  SPECLENS
                </div>


                <div
                  style={{
                    fontSize: "20px",
                    lineHeight: 1.4,
                    fontWeight: 600,
                    marginBottom:
                      "25px",
                  }}
                >
                  {reply ||
                    "Tell me more about the product."}
                </div>


                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Answer the question..."
                  rows={4}
                  style={{
                    width: "100%",
                    boxSizing:
                      "border-box",
                    resize: "vertical",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "9px",
                    padding:
                      "12px",
                    fontFamily:
                      "inherit",
                    outline: "none",
                  }}
                />


                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "flex-end",
                    marginTop: "12px",
                  }}
                >

                  <button
                    onClick={
                      handleDiscover
                    }
                    disabled={
                      loading ||
                      !message.trim()
                    }
                    style={{
                      background:
                        "#171717",
                      color: "#fff",
                      border: "none",
                      borderRadius:
                        "8px",
                      padding:
                        "11px 18px",
                      cursor: "pointer",
                      fontWeight: 650,
                    }}
                  >
                    {loading
                      ? "Thinking..."
                      : "Continue →"}
                  </button>

                </div>

              </div>


              {/* PRODUCT STATE */}

              <div
                style={{
                  background:
                    "#fff",
                  border:
                    "1px solid #e1e1e1",
                  borderRadius:
                    "14px",
                  padding: "22px",
                }}
              >

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 750,
                    letterSpacing:
                      "0.8px",
                    color: "#777",
                    marginBottom:
                      "18px",
                  }}
                >
                  PRODUCT SPEC
                </div>


                <SpecField
                  label="Product"
                  value={
                    productState.product
                  }
                />

                <SpecField
                  label="Problem"
                  value={
                    productState.problem
                  }
                />

                <SpecList
                  label="Users"
                  items={
                    productState.users
                  }
                />

                <SpecList
                  label="Context"
                  items={
                    productState.current_context
                  }
                />

                <SpecList
                  label="Goals"
                  items={
                    productState.goals
                  }
                />

                <SpecList
                  label="Requirements"
                  items={
                    productState.requirements?.map(
                      (x: any) =>
                        x.description
                    )
                  }
                />

              </div>

            </div>


            {/* ACTIONS */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "22px",
              }}
            >

              <ActionButton
                onClick={
                  handleGeneratePRD
                }
                disabled={loading}
                primary
              >
                {loading
                  ? "Generating..."
                  : "Generate PRD"}
              </ActionButton>


              <ActionButton
                onClick={
                  handleCritique
                }
                disabled={
                  loading ||
                  !prd
                }
              >
                Critique PRD
              </ActionButton>


              <ActionButton
                onClick={
                  handleGeneratePrototype
                }
                disabled={
                  loading
                }
              >
                Generate MVP Prototype
              </ActionButton>

            </div>

          </section>

        )}


        {/* PRD */}

        {prd && (

          <section
            style={{
              marginTop: "38px",
            }}
          >

            <SectionHeading
              eyebrow="GENERATED SPECIFICATION"
              title="Product Requirements Document"
            />


            <div
              style={{
                background: "#fff",
                border:
                  "1px solid #e1e1e1",
                borderRadius:
                  "14px",
                padding: "30px",
              }}
            >

              <pre
                style={{
                  margin: 0,
                  whiteSpace:
                    "pre-wrap",
                  fontFamily:
                    "inherit",
                  lineHeight: 1.7,
                  fontSize: "14px",
                }}
              >
                {prd}
              </pre>

            </div>

          </section>

        )}


        {/* CRITIQUE */}

        {critique && (

          <section
            style={{
              marginTop: "38px",
            }}
          >

            <SectionHeading
              eyebrow="AI REVIEW"
              title="PRD Critique"
            />


            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "180px 1fr",
                gap: "22px",
              }}
            >

              <div
                style={{
                  background:
                    "#171717",
                  color: "#fff",
                  borderRadius:
                    "14px",
                  padding: "24px",
                  height:
                    "fit-content",
                }}
              >

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.65,
                    marginBottom:
                      "8px",
                  }}
                >
                  SCORE
                </div>

                <div
                  style={{
                    fontSize: "48px",
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {critique.overall_score}
                </div>

                <div
                  style={{
                    marginTop:
                      "5px",
                    opacity: 0.65,
                    fontSize: "12px",
                  }}
                >
                  / 100
                </div>

              </div>


              <div
                style={{
                  background: "#fff",
                  border:
                    "1px solid #e1e1e1",
                  borderRadius:
                    "14px",
                  padding: "24px",
                }}
              >

                <p
                  style={{
                    marginTop: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {critique.summary}
                </p>


                {critique.strengths
                  ?.length > 0 && (

                  <div>

                    <h3>
                      Strengths
                    </h3>

                    <ul>
                      {critique.strengths.map(
                        (
                          item: string,
                          index: number
                        ) => (
                          <li
                            key={index}
                            style={{
                              marginBottom:
                                "8px",
                            }}
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>

                  </div>

                )}


                {critique.issues
                  ?.length > 0 && (

                  <div>

                    <h3>
                      Improvements
                    </h3>

                    {critique.issues.map(
                      (
                        issue: any,
                        index: number
                      ) => (

                        <div
                          key={index}
                          style={{
                            borderTop:
                              "1px solid #eee",
                            padding:
                              "14px 0",
                          }}
                        >

                          <strong>
                            {issue.severity?.toUpperCase()}
                            {" · "}
                            {issue.category}
                          </strong>

                          <p>
                            {issue.issue}
                          </p>

                          <small
                            style={{
                              color:
                                "#666",
                            }}
                          >
                            Suggested:
                            {" "}
                            {issue.suggestion}
                          </small>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </div>

          </section>

        )}


        {/* PROTOTYPE */}

        {prototype && (

          <section
            style={{
              marginTop: "45px",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "flex-end",
                marginBottom:
                  "18px",
                gap: "20px",
              }}
            >

              <div>

                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 750,
                    letterSpacing:
                      "1px",
                    color: "#777",
                    marginBottom:
                      "7px",
                  }}
                >
                  GENERATED MVP
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "30px",
                    letterSpacing:
                      "-1px",
                  }}
                >
                  Your prototype is ready.
                </h2>

              </div>


              <button
                onClick={() => {

                  const blob =
                    new Blob(
                      [
                        prototype.html
                      ],
                      {
                        type:
                          "text/html",
                      }
                    );

                  const url =
                    URL.createObjectURL(
                      blob
                    );

                  window.open(
                    url,
                    "_blank"
                  );

                }}
                style={{
                  background:
                    "#fff",
                  border:
                    "1px solid #ccc",
                  borderRadius:
                    "8px",
                  padding:
                    "10px 14px",
                  cursor:
                    "pointer",
                }}
              >
                Open Fullscreen ↗
              </button>

            </div>


            <div
              style={{
                background:
                  "#fff",
                border:
                  "1px solid #dcdcdc",
                borderRadius:
                  "14px",
                padding: "10px",
                boxShadow:
                  "0 10px 35px rgba(0,0,0,0.06)",
              }}
            >

              <iframe
                srcDoc={
                  prototype.html
                }
                title="Generated MVP Prototype"
                style={{
                  width: "100%",
                  height: "720px",
                  border: "none",
                  borderRadius:
                    "8px",
                  background:
                    "#fff",
                }}
              />

            </div>

          </section>

        )}


        {/* ERROR */}

        {error && (

          <div
            style={{
              marginTop: "25px",
              padding: "14px 16px",
              border:
                "1px solid #f0b7b7",
              background:
                "#fff5f5",
              color: "#a11",
              borderRadius: "9px",
              fontSize: "13px",
              whiteSpace:
                "pre-wrap",
            }}
          >
            {error}
          </div>

        )}

      </div>

    </main>
  );
}


/* -------------------------------------------------- */
/* SMALL UI COMPONENTS */
/* -------------------------------------------------- */


function StepIndicator({
  number,
  label,
  active,
}: {
  number: string;
  label: string;
  active: boolean;
}) {

  return (

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        color:
          active
            ? "#171717"
            : "#aaa",
        fontWeight:
          active
            ? 700
            : 500,
      }}
    >

      <span
        style={{
          fontSize: "10px",
          border:
            "1px solid currentColor",
          borderRadius: "50%",
          width: "23px",
          height: "23px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent:
            "center",
        }}
      >
        {number}
      </span>

      {label}

    </div>
  );
}


function SpecField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {

  return (

    <div
      style={{
        marginBottom: "18px",
      }}
    >

      <div
        style={{
          fontSize: "10px",
          fontWeight: 750,
          letterSpacing:
            "0.7px",
          color: "#999",
          textTransform:
            "uppercase",
          marginBottom: "5px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "13px",
          lineHeight: 1.5,
          color:
            value
              ? "#333"
              : "#bbb",
        }}
      >
        {value || "Not discovered yet"}
      </div>

    </div>
  );
}


function SpecList({
  label,
  items,
}: {
  label: string;
  items?: string[];
}) {

  const validItems =
    Array.isArray(items)
      ? items.filter(Boolean)
      : [];

  return (

    <div
      style={{
        marginBottom: "18px",
      }}
    >

      <div
        style={{
          fontSize: "10px",
          fontWeight: 750,
          letterSpacing:
            "0.7px",
          color: "#999",
          textTransform:
            "uppercase",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>


      {validItems.length > 0 ? (

        <ul
          style={{
            margin: 0,
            paddingLeft: "18px",
            fontSize: "13px",
            lineHeight: 1.5,
          }}
        >

          {validItems.map(
            (
              item,
              index
            ) => (
              <li
                key={index}
              >
                {item}
              </li>
            )
          )}

        </ul>

      ) : (

        <div
          style={{
            fontSize: "13px",
            color: "#bbb",
          }}
        >
          Not discovered yet
        </div>

      )}

    </div>
  );
}


function ActionButton({
  children,
  onClick,
  disabled,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {

  return (

    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background:
          primary
            ? "#171717"
            : "#fff",
        color:
          primary
            ? "#fff"
            : "#171717",
        border:
          primary
            ? "1px solid #171717"
            : "1px solid #d5d5d5",
        borderRadius: "8px",
        padding:
          "11px 16px",
        cursor:
          disabled
            ? "not-allowed"
            : "pointer",
        opacity:
          disabled
            ? 0.45
            : 1,
        fontWeight: 650,
      }}
    >
      {children}
    </button>
  );
}


function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {

  return (

    <div
      style={{
        marginBottom: "17px",
      }}
    >

      <div
        style={{
          fontSize: "10px",
          fontWeight: 750,
          letterSpacing:
            "1px",
          color: "#888",
          marginBottom:
            "6px",
        }}
      >
        {eyebrow}
      </div>

      <h2
        style={{
          margin: 0,
          fontSize: "27px",
          letterSpacing:
            "-0.8px",
        }}
      >
        {title}
      </h2>

    </div>
  );
}


const lineStyle = {
  width: "40px",
  height: "1px",
  background: "#ddd",
};