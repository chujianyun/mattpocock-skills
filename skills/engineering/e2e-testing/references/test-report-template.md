# Acceptance report

Create one report in the **tested project**, including for failed or blocked runs. Advice-only requests do not need a report. Use Chinese unless the user requests another language.

## Paths and evidence

- Save `docs/test-reports/<YYYYMMDD-HHmmss>-<feature-slug>-测试报告.md`, using the user's local time and a short filesystem-safe slug. Add a numeric suffix on collision with another task. Continue the same task in the same report, retaining significant run batches and before/after evidence.
- Store images only when present under `assets/images/<report-stem>/` beside the report; larger sanitized evidence goes under `assets/evidence/<report-stem>/`. Embed images and link artifacts relative to the report. Use platform/case/run identifiers in filenames so retests do not overwrite failures.
- Capture synthetic test data. Redact credentials and private information from text and images before retention. Auth state files are not deliverables; omit raw traces that cannot be safely sanitized and explain the missing evidence. Preserve all linked artifacts during cleanup.
- Supply the report path, format and evidence directories to `diagnosing-bugs` when invoked. Its repair findings belong in section five; this remains the sole report. Preserve its reproduction, root-cause, before/after, regression, review-if-performed and unresolved-work evidence without importing another six-section template.

## Result semantics

Record each case against its platform/device/build. Distinguish **passed on first attempt**, **failed**, **flaky** (failed then passed on retry without a repair), **skipped**, **blocked** (missing prerequisites) and **not run**. Unsupported, out-of-scope platforms are not applicable, not passed. A repair starts a new run batch; preserve the original failure instead of relabeling it.

Count case-target combinations within a named batch, not attempts. Separate setup/project dependencies and existing suites from feature cases; do not add suite totals to their child cases. Use only observed counts and timings. When discovery never ran, report the known planned checks without inventing a runner total.

A required failed, skipped, blocked, unexecuted or unresolved flaky check prevents an unqualified overall pass. Mobile web emulation, native simulator/emulator and physical devices cannot stand in for each other. Report completion is separate from acceptance success.

## Template

Replace placeholders with facts. Keep all six sections; state when a section has no activity. Remove unused example rows and missing-image blocks.

```markdown
# <功能名称> 测试报告

## 一、基本信息与结论

| 项目 | 内容 |
| --- | --- |
| 功能与验收范围 | <需求来源、必验结果与平台> |
| 测试版本 | <提交、未提交改动、应用构建；修复前后分别记录> |
| 时间 | <日期、时间及用户时区> |
| 总体结论 | <通过 / 失败 / 阻塞 / 未完成；说明范围> |

## 二、平台与设备矩阵

| 目标 ID | 必验 | 平台与系统版本 | 环境类别 | 浏览器 / 运行器 / 驱动 | 设备型号与应用构建 | 结果或阻塞 |
| --- | --- | --- | --- | --- | --- | --- |
| TARGET-01 | <是/否> | <实际值> | <桌面浏览器 / 手机网页模拟 / 原生模拟器 / 真机 / HTTP 服务> | <实际工具及版本> | <实际值；不写私有设备标识> | <已执行结果或缺失条件> |

## 三、验收标准对照

| 验收 ID | 预期业务结果 | 目标 ID | 用例 ID / 文件 | 测试层与依赖边界 | 结果 |
| --- | --- | --- | --- | --- | --- |
| AC-01 | <独立于实现的预期> | TARGET-01 | CASE-01 | <接口 / 页面隔离 / 全栈 / 原生；真实或替代依赖> | <状态> |

## 四、执行证据

| 批次 | 用例与目标 | 命令及项目相对工作目录 | 退出码 | 预期与实际输出 | 状态 | 证据 |
| --- | --- | --- | --- | --- | --- | --- |
| RUN-01 | CASE-01 / TARGET-01 | <真实命令> | <实际值；未执行写不适用> | <断言与结果摘要> | <首次通过 / 失败 / flaky / 跳过 / 阻塞 / 未执行> | <相对链接或下方输出> |

<按批次和目标汇总实际结果、数量与耗时；区分首次失败、重试、修复后新一轮执行以及既有回归套件。>

![CASE-01 实际结果](assets/images/<report-stem>/target-01-case-01-run-01.png)

图 1：<真实场景、角色、操作、观察结果及必要的采集条件>。

<缺少截图时删除图片块，说明原因并提供真实文本证据。>

## 五、缺陷修复与复测

### BUG-01 <症状>

- 关联验收项、目标与用例：<ID>
- 原始复现与失败证据：<步骤、原始批次、输出或截图链接>
- 根因：<已验证原因；未知则明确写未确认>
- 修复：<项目相对路径、行为变化和修复后版本>
- 复测与受影响回归：<命令、批次、实际结果及证据>
- 代码审查：<实际发现与处理；未开展则注明>
- 遗留：<未修复项或覆盖限制>

<未发现缺陷时直接说明，无需编造修复记录。多个缺陷复用本小节。>

## 六、未覆盖项与复查方式

- 未验证平台或用例及原因：<包括模拟与真机差异>
- 替代依赖与范围限制：<mock、sandbox、未覆盖的系统行为>
- 阻塞、剩余风险和下一步：<所需条件或具体行动>
- 复查方式：<实际入口、命令、测试角色、预期结果；不含凭据>
- 证据检查：<附件路径、图片解码及 Markdown 预览结果；未验证则说明>
```

## Delivery check

Verify every claim against retained output. Check each relative attachment from the report's own directory and preview images at readable size. If preview is unavailable, check file existence/decoding and state that visual verification is incomplete. Keep required target failures visible in the conclusion. Link the report with its actual result; do not publish it automatically.
