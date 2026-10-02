# mattpocock-skills 关系图

基于本地版本 `c55ee46` 的 `SKILL.md`、`ask-matt` 路由说明和 `.agents/invocation.md` 整理。

共 38 个技能：engineering 18 个、productivity 7 个、in-progress 9 个、misc 4 个；deprecated 为空。插件只包含前两个目录的 25 个正式技能。

图例：方框为用户显式调用，圆角胶囊为模型或用户均可调用。实线表示工作流衔接，虚线表示内部调用或按需引用。工作流衔接需要用户选择，不代表一个用户调用型技能能自动调用另一个。

## 1. 从想法到交付

`setup-matt-pocock-skills` 是工程流程的首次配置入口；`ask-matt` 负责推荐路线。图中只画主要路线，路由器也覆盖其他正式技能。

```mermaid
flowchart TB
  S["setup-matt-pocock-skills<br/>首次配置：工单、标签、文档"] --> A["ask-matt<br/>按当前问题推荐路线"]
  A --> G["grill-with-docs<br/>澄清需求，沉淀术语与决策"]
  A --> W["wayfinder<br/>大型模糊任务：逐步解决决策"]
  A --> T["triage<br/>整理外部需求与问题"]
  A --> D(["diagnosing-bugs<br/>复现、定位、修复、回归"])
  R(["research<br/>带来源的研究结论"]) --> G
  Q["to-questionnaire<br/>向知情人收集答案"] -->|回收答案| G
  G -->|需跨多个会话| SP["to-spec<br/>汇总成规格"]
  W -->|决策地图清晰后| SP
  SP --> TK["to-tickets<br/>拆分任务，声明阻塞关系"]
  TK -->|按依赖顺序，每票新会话| I["implement<br/>实现当前工作"]
  G -->|一个会话能完成| I
  T -->|已就绪的工单| I
  I -.->|实现时| TD(["tdd<br/>逐个切片：红 → 绿"])
  I -.->|提交前| CR(["code-review<br/>规范与规格双轴审查"])
  G -->|需要运行验证| H["handoff<br/>携带上下文切换目录或会话"]
  H --> P(["prototype<br/>用原型回答设计问题"])
  P -->|再次 handoff，带回结论| G
  D -->|复盘发现难以测试的边界| AR["improve-codebase-architecture<br/>发现模块深化机会"]
  AR -->|选定改造方向| G
```

`to-spec` 和 `to-tickets` 产出的内容已经面向实现准备好，无需再经过 `triage`。`wayfinder` 主要产出决策，通常先转规格再实现。原型往返都通过 `handoff` 传递上下文。

## 2. 被复用的能力与独立工具

这些虚线由技能正文中的调用或使用要求支持。`tdd` 仅在接口形状需要设计时引用 `codebase-design`。独立工具没有强制前后顺序。

```mermaid
flowchart TB
  subgraph Entry["流程入口"]
    GM["grill-me<br/>无状态追问"]
    GD["grill-with-docs"]
    TR["triage"]
    WF["wayfinder"]
    AR["improve-codebase-architecture"]
    TD(["tdd"])
  end
  subgraph Core["可复用能力"]
    GR(["grilling<br/>持续追问，厘清决策"])
    DM(["domain-modeling<br/>统一术语，更新 CONTEXT 与 ADR"])
    CD(["codebase-design<br/>深模块、简单接口、测试边界"])
    RS(["research<br/>调查事实"])
    PT(["prototype<br/>验证设计"])
  end
  GM -.-> GR
  GD -.-> GR
  GD -.-> DM
  TR -.->|需要澄清时| GR
  TR -.->|需要澄清时| DM
  WF -.-> GR
  WF -.-> DM
  WF -.->|研究类决策| RS
  WF -.->|原型类决策| PT
  AR -.->|选定候选后| GR
  AR -.-> DM
  AR -.-> CD
  TD -.->|按需设计接口| CD
  subgraph Tools["独立工具：按场景使用"]
    WI(["wizard<br/>为必须由人完成的操作生成向导"])
    MC(["resolving-merge-conflicts<br/>按双方意图处理冲突"])
    TE["teach<br/>跨会话学习"]
    WW["wait-what<br/>把没听懂的解释重新讲清楚"]
    WA(["writing-for-agents<br/>编写面向智能体的文档"])
  end
```

`grill-me` 与 `grill-with-docs` 复用同一套追问能力；后者额外维护领域模型与决策文档。读取 `CONTEXT.md` 本身不等于调用 `domain-modeling`。

## 3. 实验技能与低频工具

以下 13 个技能不随正式插件分发。写作三件套的实线表示根据输入输出整理的可组合路径，不是声明的自动调用；两种成文方式是可选分支。`retro` 目前仅有设计草稿，尚不可作为完整技能使用。

```mermaid
flowchart TB
  subgraph Beta["in-progress · 9 个实验技能"]
    FR["writing-fragments<br/>访谈并收集写作碎片"]
    SH["writing-shape<br/>逐段组织文章"]
    BE["writing-beats<br/>逐个叙事节拍推进"]
    LM["loop-me<br/>跨会话澄清工作流规格"]
    IS["implement-spec<br/>多代理按任务依赖实现整份规格"]
    CH["claude-handoff<br/>将上下文交给新后台代理"]
    TS["setup-ts-deep-modules<br/>配置 TypeScript 模块边界检查"]
    PR(["pr<br/>PR 描述写作规范"])
    RE["retro<br/>环境改进复盘：仅设计草稿"]
    FR -->|原始素材，可选路径| SH
    FR -->|原始素材，可选路径| BE
  end
  subgraph Reuse["复用正式技能"]
    GR(["grilling"])
    CR(["code-review"])
    CD(["codebase-design"])
    WA(["writing-for-agents"])
  end
  LM -.-> GR
  IS -.->|完成全部任务后| CR
  TS -.-> CD
  RE -.->|草稿中的计划| WA
  subgraph Misc["misc · 4 个低频独立工具"]
    GG(["git-guardrails-claude-code<br/>危险 Git 命令防护钩子"])
    MS(["migrate-to-shoehorn<br/>替换测试中的类型断言"])
    SE(["scaffold-exercises<br/>生成课程练习目录"])
    PC(["setup-pre-commit<br/>配置提交前检查"])
  end
```

## 依据

- [主流程与路由说明](skills/engineering/ask-matt/SKILL.md)
- [调用规则](.agents/invocation.md)
- [工程技能](skills/engineering/README.md)
- [效率技能](skills/productivity/README.md)
- [实验技能](skills/in-progress/README.md)
- [低频工具](skills/misc/README.md)
- [TDD 的当前规则](skills/engineering/tdd/SKILL.md)：当前实现循环是红 → 绿，重构属于审查阶段。
