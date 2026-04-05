# AstroLLM — Project Plan & Research Blueprint

*A fine-tuned Large Language Model for Astronomy & Astrophysics*
*Domain: astrollm.org*

---

## 1. Claude Code Project Prompt

Copy the following prompt into Claude Code to scaffold the entire project:

---

```
You are helping me build AstroLLM — a domain-specialized Large Language Model for Astronomy and Astrophysics. The goal is to create a fine-tuned model that enhances learning, facilitates research discussions, supports co-research workflows, and continuously builds updated astronomical knowledge.

## Project Context

I am studying LLM internals (Raschka's "Build a Large Language Model from Scratch", Karpathy's NanoGPT lectures) and want to apply this knowledge to create a practical, astronomy-specialized model. The project should be designed so I can start small and scale up.

### Existing Landscape (Positioning)
- AstroMLab's AstroSage-Llama-3.1-70B/8B are the current SOTA for astronomy LLMs
- AstroSage-8B achieves 80.9% on AstroMLab-1 benchmark (on par with GPT-4o)
- AstroSage-70B achieves 86.2%, tying with Claude-4-Opus
- Early AstroLLaMA models suffered catastrophic forgetting — data quality is critical
- Key lesson: CPT (Continued Pre-Training) + SFT (Supervised Fine-Tuning) + Model Merging is the proven pipeline

### AstroLLM's Differentiated Focus
AstroLLM targets areas underserved by AstroSage:
1. **Interactive learning & pedagogy** — Socratic teaching, adaptive explanations, concept scaffolding
2. **Research co-pilot** — Literature synthesis, hypothesis generation, data interpretation workflows
3. **Living knowledge base** — Continuous ingestion of new arXiv papers via RAG + periodic re-training
4. **Multimodal astronomy** — Integration with spectral data, light curves, sky survey images (future phase)
5. **Accessible deployment** — Optimized for consumer hardware via quantization, not just supercomputer-scale

## What to Create

### 1. Project Structure
Create a complete Claude Code project scaffold in the `.claude/` directory pattern I use for my projects:
- `CLAUDE.md` with project overview, architecture, and conventions
- `.claude/` folder with agent personas, slash commands, and project config
- Monorepo structure using my preferred stack where applicable

### 2. Architecture Documentation
Design and document:
- **Data Pipeline**: arXiv paper ingestion → cleaning → formatting → training data
  - Source: arXiv astro-ph (bulk API), NASA ADS, astronomy textbooks (public domain)
  - Processing: LaTeX → clean text, section extraction, Q&A pair generation
  - Quality filters: deduplication, length filters, topic classification
- **Training Pipeline**: Base model → CPT → SFT → Evaluation → Model Merging
  - Base models to support: Llama 3.x (8B, 70B), Qwen 2.5, Mistral
  - CPT on astronomy corpus (papers, textbooks, encyclopedias)
  - SFT on curated Q&A pairs, reasoning chains, multi-turn conversations
  - DPO/RLHF for preference alignment (Phase 3+)
- **RAG System**: For real-time knowledge augmentation
  - Vector store: PostgreSQL + pgvector
  - Embedding model: astronomy-tuned or general-purpose
  - Retrieval: semantic search over paper chunks + metadata filtering
- **Evaluation Framework**:
  - AstroMLab-1 benchmark (4,425 MCQs)
  - Astro-QA benchmark (3,082 questions)
  - Custom pedagogy evaluation (teaching quality, explanation clarity)
  - Hallucination detection specific to astronomical facts

### 3. Implementation Roadmap
Create a phased plan:

**Phase 0 — Foundation (Weeks 1-4)**
Learning & environment setup. Build NanoGPT from scratch on small astronomy corpus.
Reproduce key results from the book. Set up training infrastructure.

**Phase 1 — Data Pipeline (Weeks 5-8)**
Build the arXiv ingestion system. Process astro-ph papers. Generate SFT datasets.
Create evaluation benchmarks. Build RAG prototype.

**Phase 2 — First Fine-Tune (Weeks 9-14)**
QLoRA fine-tune of Llama 3.x 8B on astronomy corpus.
Evaluate against benchmarks. Iterate on data quality.
Deploy locally for testing.

**Phase 3 — RAG + Chat Interface (Weeks 15-20)**
Build web interface for interaction. Integrate RAG system.
Add paper search and citation. Deploy beta version.

**Phase 4 — Scale & Specialize (Weeks 21-30)**
Full fine-tune or larger model. DPO alignment.
Multimodal extensions. Community features.
Continuous learning pipeline.

### 4. Tech Stack
- **Runtime**: Bun
- **Training**: PyTorch, Hugging Face Transformers, PEFT, TRL, Unsloth
- **Data Processing**: Python (arxiv API, pdfminer, regex for LaTeX)
- **RAG Backend**: Elysia + PostgreSQL/pgvector
- **Frontend**: TanStack Start + Shadcn/ui + Tailwind
- **Experiment Tracking**: Weights & Biases (W&B)
- **Model Serving**: vLLM or llama.cpp
- **Infrastructure**: Docker, with configs for local GPU, RunPod, Lambda Labs

### 5. Repository Structure
```
astrollm/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── personas/
│   └── commands/
├── packages/
│   ├── data-pipeline/          # arXiv ingestion, processing, dataset creation
│   ├── training/               # Fine-tuning scripts, configs, experiment tracking
│   ├── evaluation/             # Benchmark runners, custom eval suites
│   ├── rag/                    # Vector store, retrieval, embedding pipeline
│   ├── inference/              # Model serving, quantization, deployment
│   └── web/                    # Chat interface, API, dashboard
├── data/
│   ├── raw/                    # Downloaded papers
│   ├── processed/              # Cleaned training data
│   ├── sft/                    # Supervised fine-tuning datasets
│   └── eval/                   # Evaluation datasets
├── models/                     # Model checkpoints, adapters
├── configs/                    # Training configs, hyperparameters
├── scripts/                    # Utility scripts
├── docs/                       # Architecture docs, research notes
│   ├── ARCHITECTURE.md
│   ├── DATA_PIPELINE.md
│   ├── TRAINING_GUIDE.md
│   └── RESEARCH_LOG.md
└── docker/                     # Dockerfiles for different environments
```

Create the full scaffold with placeholder files, READMEs, and initial configurations.
Focus on making this immediately usable for starting Phase 0.
```

---

## 2. Research & Implementation Plan

### 2.1 Landscape Analysis — What Already Exists

The astronomy LLM space has matured significantly. Understanding prior work is essential to avoid redundant effort and learn from documented failures.

**AstroMLab / AstroSage (2023–2026)** — The dominant project. A collaboration between KEK (Japan), Ohio State, Oak Ridge National Lab, and NASA ADS. Their key innovations:
- **AstroSage-Llama-3.1-70B** achieves 86.2% on their benchmark, outperforming o3, GPT-4.1, Claude-3.7-Sonnet, and Gemini-2.5-Pro
- **AstroSage-Llama-3.1-8B** achieves 80.9%, matching GPT-4o with 8B parameters
- Training pipeline: Continued Pre-Training (CPT) → Supervised Fine-Tuning (SFT) → Model Merging
- Data: Complete arXiv astro-ph papers (2007–2024), synthetic Q&A pairs, metadata datasets
- The 70B model consumed ~43,000 GPU-hours on AMD MI250X (Frontier supercomputer)
- Critical lesson: Early AstroLLaMA models (7B) actually *underperformed* their base LLaMA models due to catastrophic forgetting and poor SFT data

**"Talking with the Latents" (Feb 2026)** — A novel approach using teacher-student knowledge distillation to inject physical reasoning into LLMs via latent features + LoRA. Outperforms Gemini 3 Pro on downstream tasks without task-specific fine-tuning.

**Astro-QA Benchmark (2025)** — 3,082 questions across 6 types (MCQ, matching, terminology, short-answer) in English and Chinese, covering astrophysics, astrometry, celestial mechanics, history, and techniques.

**RAG for Astronomy (2024)** — Slack-based chatbot using RAG over arXiv astro-ph papers. Key finding: RAG reduces hallucinations and enables access to information beyond training data.

### 2.2 AstroLLM's Differentiated Value Proposition

Rather than competing head-to-head with AstroSage (which has supercomputer-scale resources), AstroLLM should target underserved niches:

| Dimension | AstroSage | AstroLLM (Target) |
|-----------|-----------|-------------------|
| Primary goal | Benchmark performance | Learning + research co-pilot |
| Training scale | 43K GPU-hours (70B) | Efficient fine-tuning (LoRA/QLoRA) |
| Deployment | Research clusters | Consumer hardware + cloud |
| Knowledge freshness | Static (trained to 2024) | Living (RAG + periodic updates) |
| Interaction mode | Q&A | Socratic teaching, guided exploration |
| Audience | Researchers | Researchers + students + enthusiasts |

### 2.3 Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                   AstroLLM System                    │
├──────────┬──────────┬──────────┬────────────────────┤
│  Data    │ Training │  RAG     │  Serving           │
│  Pipeline│ Pipeline │  System  │  Layer             │
├──────────┼──────────┼──────────┼────────────────────┤
│ arXiv    │ CPT      │ pgvector │ vLLM / llama.cpp   │
│ NASA ADS │ SFT      │ Embed    │ Quantized (GGUF)   │
│ Textbooks│ LoRA     │ Rerank   │ Web UI             │
│ Q&A Gen  │ DPO      │ Chunk    │ API                │
└──────────┴──────────┴──────────┴────────────────────┘
```

#### Data Pipeline
1. **Ingestion**: Bulk download arXiv astro-ph papers via OAI-PMH or Kaggle dataset
2. **Extraction**: LaTeX source → clean text (remove figures, tables, references), extract abstracts/intros/conclusions
3. **Q&A Generation**: Use Claude/GPT-4 to generate high-quality Q&A pairs from paper content
4. **Reasoning Chains**: Generate step-by-step explanations for complex astronomical concepts
5. **Pedagogy Data**: Create Socratic dialogue datasets, multi-turn teaching conversations
6. **Quality Control**: Deduplication, human spot-checks, automated consistency validation

#### Training Pipeline
1. **Continued Pre-Training (CPT)**: Train on raw astronomy text to build domain knowledge
2. **Supervised Fine-Tuning (SFT)**: Train on curated Q&A, reasoning, and dialogue data
3. **Model Merging**: Merge SFT model with instruct model to preserve general capabilities (SLERP, TIES, DARE)
4. **Optional DPO**: Direct Preference Optimization for response quality alignment
5. **Evaluation**: Run against AstroMLab-1, Astro-QA, and custom pedagogy benchmarks

#### RAG System
- **Embedding**: Use astronomy-aware embeddings (or fine-tune a general embedder on astro text)
- **Chunking**: Section-aware chunking (respect paper structure: abstract, intro, methods, results)
- **Retrieval**: Hybrid search (semantic + keyword) with metadata filters (date, topic, citation count)
- **Reranking**: Cross-encoder reranker for precision on top-k results

### 2.4 Phased Implementation Plan

#### Phase 0 — Foundation & Learning (4 weeks)

**Goal**: Build deep understanding of LLM internals and set up infrastructure.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 1 | Complete relevant chapters of Raschka's book | Notes, working GPT-2 implementation |
| 2 | Karpathy's NanoGPT: train on small astronomy corpus | Working NanoGPT trained on astro abstracts |
| 3 | Study AstroSage papers in depth, analyze their pipeline | Research notes, identified gaps |
| 4 | Set up training infrastructure (local GPU or cloud) | Docker configs, W&B account, initial scripts |

#### Phase 1 — Data Pipeline (4 weeks)

**Goal**: Build production-quality data pipeline and create training datasets.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 5 | arXiv bulk download + LaTeX processing pipeline | Ingestion scripts, ~300K processed papers |
| 6 | Q&A pair generation using Claude API | 50K+ high-quality Q&A pairs |
| 7 | Pedagogy dataset: Socratic dialogues, explanations | 10K+ teaching conversations |
| 8 | Evaluation dataset creation + RAG prototype | Eval suite, basic vector search working |

#### Phase 2 — First Fine-Tune (6 weeks)

**Goal**: Produce a working astronomy-specialized model.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 9-10 | QLoRA fine-tune Llama 3.x 8B (CPT phase) | CPT checkpoint, loss curves, W&B logs |
| 11-12 | SFT on Q&A + pedagogy data | SFT checkpoint, initial benchmark scores |
| 13 | Model merging experiments (SLERP, TIES) | Merged model, benchmark comparison |
| 14 | Quantize (GGUF) + local deployment | Quantized model running on consumer hardware |

#### Phase 3 — RAG + Interface (6 weeks)

**Goal**: Build user-facing system with living knowledge.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 15-16 | Full RAG pipeline (pgvector, chunking, retrieval) | RAG system serving astronomy papers |
| 17-18 | Web chat interface (TanStack Start + Elysia) | Working web UI with paper citations |
| 19-20 | Beta testing, prompt engineering, UX refinement | Beta deployment at astrollm.org |

#### Phase 4 — Scale & Specialize (10 weeks)

**Goal**: Push performance and add advanced features.

| Week | Focus | Deliverables |
|------|-------|-------------|
| 21-24 | Larger model fine-tune (70B with cloud GPUs) | 70B model, benchmark comparison |
| 25-26 | DPO alignment training | Preference-aligned model |
| 27-28 | Continuous learning pipeline (auto-ingest new papers) | Automated update system |
| 29-30 | Multimodal prototype (spectra, light curves) | Proof-of-concept multimodal input |

---

## 3. Learning Path

### Track A — LLM Fundamentals (Weeks 1-6)

This track builds your understanding of transformer architecture and training from the ground up.

**Week 1-2: Architecture Deep Dive**
- Complete Raschka's "Build a LLM from Scratch" chapters on attention and transformer blocks
- Implement multi-head self-attention from scratch in PyTorch
- Study: "Attention Is All You Need" (Vaswani et al., 2017)
- Karpathy's "Let's build GPT from scratch" YouTube lecture (implement along)

**Week 3-4: Training & NanoGPT**
- Karpathy's NanoGPT series: reproduce GPT-2 training
- Implement on a small astronomy corpus (download ~10K arXiv abstracts)
- Understand: loss functions, learning rate schedules, gradient accumulation
- Study tokenization deeply: BPE, SentencePiece, how domain text affects tokenization

**Week 5-6: Fine-Tuning Theory**
- Read the LoRA paper (Hu et al., 2022): understand low-rank decomposition
- Read the QLoRA paper (Dettmers et al., 2023): 4-bit quantization + LoRA
- Study the AstroSage papers (de Haan et al., 2025): their CPT → SFT → merge pipeline
- Understand catastrophic forgetting and why early AstroLLaMA models failed

### Track B — Practical Fine-Tuning Skills (Weeks 4-10)

**Week 4-5: Tooling Setup**
- Set up Hugging Face ecosystem: transformers, PEFT, TRL, datasets
- Install and configure Unsloth (2-4x faster LoRA training)
- Set up Weights & Biases for experiment tracking
- Run a basic LoRA fine-tune tutorial on a small model (Llama 3.2 1B or 3B)

**Week 6-7: Data Engineering**
- Build arXiv download pipeline (arxiv Python package + bulk data access)
- Learn LaTeX parsing: regex extraction of sections, cleaning math notation
- Study AstroSage's approach: they extracted abstracts, intros, and conclusions
- Practice: generate Q&A pairs from papers using Claude API

**Week 8-9: Your First Real Fine-Tune**
- QLoRA fine-tune Llama 3.x 8B on your astronomy dataset
- Experiment with hyperparameters: rank, alpha, learning rate, epochs
- Evaluate: perplexity on held-out astro text, benchmark scores
- Compare: base model vs your fine-tune on astronomy questions

**Week 10: Model Merging & Deployment**
- Study model merging techniques: SLERP, TIES, DARE
- Use mergekit to merge your SFT model with an instruct model
- Quantize to GGUF format using llama.cpp
- Deploy locally with Ollama or vLLM

### Track C — RAG & Systems (Weeks 8-14)

**Week 8-9: Embeddings & Vector Search**
- Understand embedding models and similarity search
- Set up PostgreSQL + pgvector
- Build a basic semantic search over astronomy paper chunks

**Week 10-11: RAG Pipeline**
- Study chunking strategies (section-aware vs fixed-size)
- Implement retrieval-augmented generation pipeline
- Add citation tracking (link answers back to source papers)

**Week 12-14: Production Systems**
- Build API server (Elysia) with streaming responses
- Build chat interface (TanStack Start)
- Deploy with Docker (model serving + web app + database)

### Recommended Reading List

**Essential Papers:**
1. "Attention Is All You Need" — Vaswani et al., 2017
2. "LoRA: Low-Rank Adaptation" — Hu et al., 2022
3. "QLoRA: Efficient Finetuning" — Dettmers et al., 2023
4. "AstroMLab 3: AstroSage-Llama-3.1-8B" — de Haan et al., 2025
5. "AstroMLab 4: AstroSage-Llama-3.1-70B" — de Haan et al., 2025
6. "Talking with the Latents" — Kamai et al., 2026
7. "Direct Preference Optimization" — Rafailov et al., 2023

**Books:**
1. "Build a Large Language Model from Scratch" — Sebastian Raschka (you're reading this)
2. "Hands-On Large Language Models" — Alammar & Grootendorst

**Video Courses:**
1. Andrej Karpathy — Neural Networks: Zero to Hero (YouTube)
2. Andrej Karpathy — Let's build GPT from scratch (YouTube)
3. Hugging Face — NLP Course (free, huggingface.co/learn)

---

## 4. Budget Tiers

### Tier 1 — Lean Researcher ($50–200/month)

**Hardware**: Consumer GPU (RTX 3090/4090 24GB) or Apple Silicon Mac (M2/M3/M4 with 32GB+)

**Approach**:
- QLoRA fine-tuning of 8B models on local hardware
- 4-bit quantization keeps the full 8B model + LoRA adapters within 24GB VRAM
- Training time: 4-12 hours per fine-tune run depending on dataset size
- RAG system runs locally alongside the model

**Cloud Supplement**: RunPod or Lambda Labs spot instances for occasional larger runs
- RTX 4090: ~$0.40-0.80/hour → a 10-hour training run costs $4-8
- A100 80GB (for 70B QLoRA experiments): ~$1.50-2.50/hour spot

**Budget Breakdown:**

| Item | Monthly Cost |
|------|-------------|
| Cloud GPU (RunPod spot, ~20-40 hrs) | $30-80 |
| Claude API for Q&A generation | $10-50 |
| Domain + hosting (astrollm.org) | $5-15 |
| W&B (free tier) | $0 |
| Hugging Face (free tier) | $0 |
| **Total** | **$50-150** |

**What you get**: A working QLoRA-tuned 8B model that runs on your local machine, a RAG system, and a basic web interface. Benchmark performance likely 5-10 points above base Llama on astronomy tasks. Limited by dataset size (generate ~10-20K Q&A pairs within API budget).

**Timeline to first results**: 8-10 weeks

---

### Tier 2 — Serious Builder ($500–2,000/month)

**Hardware**: Cloud-first with optional local GPU

**Approach**:
- Full LoRA (not quantized) fine-tuning of 8B models on A100 80GB
- QLoRA fine-tuning of 70B models for experimentation
- Larger SFT dataset generation (50-100K Q&A pairs)
- Professional RAG deployment with managed PostgreSQL

**Cloud Infrastructure:**
- Lambda Labs or RunPod reserved A100 80GB: ~$1.50-2.00/hour
- Budget for ~100-200 GPU-hours/month of training
- Managed PostgreSQL (Supabase or Neon) for pgvector

**Budget Breakdown:**

| Item | Monthly Cost |
|------|-------------|
| Cloud GPU (A100, ~100-200 hrs) | $200-600 |
| Claude API for data generation | $100-300 |
| Managed database (pgvector) | $25-50 |
| Hosting (VPS for web app + inference) | $50-200 |
| Domain + CDN | $10-20 |
| W&B Pro | $50 |
| **Total** | **$500-1,500** |

**What you get**: A properly fine-tuned 8B model (potentially approaching AstroSage-8B territory on benchmarks), a 70B QLoRA experiment, a polished web interface at astrollm.org with RAG-augmented responses, and a larger high-quality training dataset. Enough compute for 5-10 training iterations to refine hyperparameters.

**Timeline to production beta**: 14-16 weeks

---

### Tier 3 — Research Lab ($5,000–20,000/month)

**Hardware**: Multi-GPU cloud cluster or dedicated server

**Approach**:
- Full fine-tuning of 8B models (no LoRA constraints)
- LoRA/QLoRA fine-tuning of 70B models with extensive hyperparameter search
- Massive SFT dataset (200K+ Q&A pairs, reasoning chains, dialogues)
- CPT on full arXiv astro-ph corpus (~300K papers)
- DPO alignment training
- Multimodal experiments (spectral data, images)

**Cloud Infrastructure:**
- 4-8x A100/H100 cluster (Lambda Labs, CoreWeave, or AWS)
- H100 80GB: ~$2.50-4.00/hour → 8x H100 cluster ~$20-32/hour
- Budget for ~500-1,000 GPU-hours/month

**Budget Breakdown:**

| Item | Monthly Cost |
|------|-------------|
| Cloud GPU cluster (H100s, ~500+ hrs) | $3,000-12,000 |
| Claude API (large-scale data generation) | $500-1,000 |
| Infrastructure (managed DB, hosting, CDN) | $200-500 |
| W&B Teams | $150 |
| Human evaluation / annotation | $500-2,000 |
| Storage (model checkpoints, datasets) | $100-300 |
| **Total** | **$5,000-16,000** |

**What you get**: A model competitive with AstroSage on benchmarks, extensive ablation studies publishable as a paper, a production-quality web application, continuous learning pipeline, and potentially a multimodal proof-of-concept. Enough compute for CPT + SFT + DPO + model merging experiments at 70B scale.

**Timeline to competitive model**: 20-24 weeks

---

### Budget Decision Matrix

| Factor | Lean ($50-200) | Serious ($500-2K) | Lab ($5K-20K) |
|--------|----------------|-------------------|---------------|
| Model size | 8B (QLoRA) | 8B full + 70B QLoRA | 70B full |
| Dataset size | 10-20K pairs | 50-100K pairs | 200K+ pairs |
| Training iterations | 3-5 | 10-20 | 50+ |
| Benchmark target | Base +5-10% | Near AstroSage-8B | Match/beat AstroSage |
| Publishable? | Blog post | Workshop paper | Conference paper |
| Deployment | Local / 1 user | Small beta | Public service |
| Recommended start? | ✅ Start here | Scale to this | Goal state |

**Recommendation**: Start at Tier 1 to validate your pipeline and learn the workflow. The most expensive mistakes in ML are made before you understand your data. Scale to Tier 2 once your data pipeline is solid and you've done 3-5 successful training runs. Tier 3 only when you have a clear hypothesis to test at scale.

---

## 5. Domain Name Recommendation

**astrollm.org** is the strong choice:

- Reads clearly as "Astro + LLM" — the double-L is the natural join point
- Brand it as **AstroLLM** in copy, logos, and documentation
- Avoids confusion: "astrolm" could be misread as "a-strolm" or "astro-lm" (missing the LLM signal)
- Precedent: The original AstroLLaMA project already uses the "AstroLL-" prefix pattern
- Check: The existing AstroMLab project uses "astromlab.org" — your domain is distinct

Register both `astrollm.org` and `astrollm.com` if available. Consider also grabbing `astrollm.ai`.

---

## 6. Key Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Catastrophic forgetting (model gets worse) | Use model merging (SLERP/TIES) to preserve base capabilities; this was the key fix for AstroSage |
| Poor SFT data quality | Invest heavily in data curation; use Claude to generate + human spot-check |
| Competing with AstroSage on benchmarks | Don't compete on benchmarks — differentiate on pedagogy, UX, and accessibility |
| GPU costs spiraling | Start with QLoRA on consumer hardware; only scale when pipeline is validated |
| arXiv data licensing | arXiv bulk data is CC-licensed; verify paper-level licenses for commercial use |
| Hallucination in scientific context | RAG provides grounding; always link claims to source papers |

---

## 7. Success Metrics

**Phase 2 (First Model):**
- AstroMLab-1 benchmark: >75% accuracy (base Llama 3.x 8B is ~72%)
- Astro-QA: measurable improvement over base model
- Qualitative: 3 astronomers rate explanations as "helpful" in blind comparison

**Phase 3 (Beta):**
- 50+ beta users providing feedback
- RAG retrieval accuracy: >80% relevant papers in top-5
- Response latency: <5s for standard queries

**Phase 4 (Production):**
- AstroMLab-1: >80% (approaching AstroSage-8B territory)
- 500+ monthly active users
- Paper submitted to ML4Astro workshop or AstroMLab collaboration
