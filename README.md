SpecLens

SpecLens is a local AI product development tool that turns an initial product idea into a structured product specification.

The project is built around the idea that a product concept usually starts as incomplete information. Instead of asking a user to write a complete PRD from the beginning, SpecLens guides the user through product discovery and gradually builds a structured product state.

The current system uses a local language model through Ollama. The backend is built with FastAPI and Pydantic, while the frontend is built with Next.js and TypeScript.

What SpecLens currently does

Product Discovery

The discovery agent takes a user's product idea and extracts useful product information from each message.

The current product state contains:

Product

Problem

Users

Current context

Goals

Requirements

User stories

Acceptance criteria

Open questions

The state is preserved between discovery messages so that information already collected is not lost.

The discovery agent also asks one follow up question at a time to identify missing information and progressively improve the specification.

Structured Product Model

The product state is represented with Pydantic models.

Requirements contain a description and type.

User stories contain an actor, action, and goal.

Acceptance criteria contain a description.

This provides a validated structure between the language model, backend, PRD generation, critique, and prototype generation stages.

PRD Generation

SpecLens can generate a PRD from the structured product state.

The current generator produces sections covering the product, problem, target users, goals, requirements, user stories, acceptance criteria, edge cases, and open questions.

The current implementation is intentionally simple and provides the foundation for a more complete PRD generation system.

PRD Critique

The project includes a PRD critic that evaluates the current product specification.

It provides an overall score, strengths, issues, severity levels, categories, and suggestions.

The purpose of the critic is to identify gaps before the product moves into implementation.

MVP Prototype Generation

SpecLens also includes an early prototype generation pipeline.

The backend can generate an HTML prototype from the structured product state. The prototype system is intended to turn the product specification into a basic interactive representation of the proposed product.

This creates a path from an idea to a specification and then to something that can be visually explored.

Technology

Backend

Python

FastAPI

Pydantic

Ollama

Qwen3 4B

Frontend

Next.js

React

TypeScript

The language model runs locally through Ollama rather than relying on a hosted model API.

Current Architecture

User idea

Product discovery

Structured product state

PRD generation

PRD critique

MVP prototype generation

The structured product state acts as the central representation shared by the different stages.

Current Development Status

SpecLens is currently a working beta rather than a finished product.

The core backend pipeline is functional and has been tested through the API.

The discovery system can preserve information across multiple messages and populate different parts of the product state.

The PRD generator can convert the state into a readable PRD.

The critic can evaluate the specification and identify missing information.

The prototype generator can produce an early HTML representation from the product state.

The frontend currently exposes the main discovery, PRD generation, and critique workflow. The interface is still in an early development state and needs further work before it is ready for public use.

Next Development

The next stage is to improve the PRD generation system.

The goal is to make SpecLens capable of producing a much more complete product document from a rough idea while clearly separating information provided by the user from assumptions made during product discovery.

The PRD format will be expanded to include areas such as product overview, problem analysis, target users, jobs to be done, proposed solution, MVP scope, success metrics, user stories, functional requirements, non functional requirements, prioritization, risks, validation planning, roadmap, and open questions.

The system should remain general purpose. It should not be tied to a particular industry, company, product category, or feature type.

The prototype generator will then be improved so that the generated prototype reflects the product requirements instead of producing a generic interface.

The frontend will also be redesigned into a complete product workflow where a user can enter an idea, continue discovery, review the structured specification, generate the PRD, inspect the critique, and generate an MVP prototype without interacting directly with the backend API.

Additional planned improvements include better model output reliability, stronger validation, improved handling of incomplete information, better prototype generation, persistent projects, and deployment of the application for public access.

Development Goal

The long term goal of SpecLens is to create a product development workspace where a rough idea can be progressively transformed into a validated product specification and an MVP prototype.

The project is being developed incrementally, starting with local AI and a small validated product state before adding more advanced product reasoning and generation capabilities.
