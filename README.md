# SpecLens

SpecLens is a local AI product development tool that helps turn a rough product idea into a structured product specification, PRD, critique, and early MVP prototype.

The idea behind SpecLens is simple. Most product ideas start with incomplete information. Instead of asking someone to write a complete PRD from the beginning, SpecLens guides the user through product discovery and gradually builds the specification.

The current version runs locally using Ollama and Qwen3 4B. The backend uses FastAPI and Pydantic, while the frontend uses Next.js, React, and TypeScript.

## What It Does

SpecLens currently takes a product idea through the following workflow:

Product idea

Product discovery

Structured product specification

PRD generation

PRD critique

MVP prototype generation

DOCX export

The structured product state is shared between these stages so that the information collected during discovery can be reused throughout the rest of the workflow.

## Product Discovery

The discovery system takes a rough product idea and gradually extracts the information needed to build a product specification.

The current product state includes:

Product

Problem

Users

Current context

Goals

Requirements

User stories

Acceptance criteria

Open questions

The discovery process preserves information collected from previous messages and asks one follow up question at a time to identify missing information.

The system is designed to work with different types of products and is not restricted to a specific industry or product category.

## Structured Product Model

The product specification is represented using Pydantic models.

Requirements contain a description and type.

User stories contain an actor, action, and goal.

Acceptance criteria contain a description.

This provides a structured layer between the language model and the rest of the application.

The same product state is used by the PRD generator, PRD critic, prototype generator, and document exporter.

## PRD Generation

SpecLens can generate a PRD from the structured product state.

The current PRD includes:

Product

Problem

Target users

Goals

Requirements

User stories

Acceptance criteria

Edge cases

Open questions

The current generator provides the foundation for a more detailed PRD system that will eventually cover areas such as product strategy, MVP scope, success metrics, prioritization, risks, validation, and roadmap planning.

## PRD Critique

The PRD critic evaluates the current product specification and identifies areas that need more work.

It provides:

Overall score

Strengths

Issues

Severity

Category

Suggestions

The purpose of this stage is to identify gaps in the specification before moving towards implementation.

## MVP Prototype Generation

SpecLens includes an early prototype generation pipeline.

The system uses the structured product state to generate an HTML representation of the proposed product.

The prototype is intended to make the product idea easier to understand and review before actual development begins.

The current prototype system is an early implementation and will be improved to make the generated interface more closely reflect the actual requirements and user flows.

## DOCX Export

SpecLens also includes a document export system for generating a Word document from the product specification.

This makes it possible to take the generated product information outside the application and use it as a working product document.

The exporter is part of the backend and works with the structured product state rather than directly using raw model output.

## Frontend

The frontend provides the main interface for working with SpecLens.

The current interface includes:

Discovery panel

PRD document view

PRD critique panel

Prototype panel

Header

Hero section

Reusable UI components

The frontend is built with Next.js, React, and TypeScript.

## Technology

Backend

Python

FastAPI

Pydantic

Requests

Ollama

Qwen3 4B

Frontend

Next.js

React

TypeScript

Document generation

Python

python-docx

## Architecture

The current workflow is:

User idea

Product discovery

Structured product state

PRD generation

PRD critique

MVP prototype generation

Document export

The structured product state acts as the central layer connecting the different stages.

## Project Structure

```text
speclens
|
|-- backend
|   |-- agents
|   |   |-- discovery.py
|   |   |-- prd_generator.py
|   |   |-- prd_critic.py
|   |   |-- prototype_generator.py
|   |
|   |-- analysis
|   |-- exporters
|   |   |-- docx_exporter.py
|   |
|   |-- llm
|   |   |-- ollama_client.py
|   |
|   |-- parser
|   |-- schemas
|   |-- tests
|   |-- main.py
|
|-- frontend
|   |-- app
|   |-- components
|   |   |-- CritiquePanel.tsx
|   |   |-- DiscoveryPanel.tsx
|   |   |-- Header.tsx
|   |   |-- Hero.tsx
|   |   |-- PRDDocument.tsx
|   |   |-- PrototypePanel.tsx
|   |   |-- ui.tsx
|   |
|   |-- lib
|   |-- package.json
|
|-- docs
|-- examples
|-- README.md
