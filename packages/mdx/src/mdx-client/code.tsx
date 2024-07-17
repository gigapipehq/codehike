import React from "react"
import { CodeSpring } from "../smooth-code"
import { EditorSpring, EditorStep } from "../mini-editor"
import {
  CodeConfigProps,
  ElementProps,
  GlobalConfig,
} from "../core/types"

type Props = {
  editorStep: EditorStep
  globalConfig: GlobalConfig
} & ElementProps &
  CodeConfigProps

export function Code(props: Props) {
  const { editorStep, globalConfig, ...codeConfigProps } =
    props
  const [step, setStep] = React.useState(editorStep)

  function onTabClick(filename: string) {
    const newStep = updateEditorStep(
      props.editorStep,
      filename,
      null
    )
    setStep({ ...step, ...newStep })
  }

  return (
    <InnerCode
      editorStep={step}
      onTabClick={onTabClick}
      globalConfig={globalConfig}
      codeConfigProps={codeConfigProps}
    />
  )
}

// build the CodeConfig from props and props.codeConfig
export function mergeCodeConfig<T>(
  props: Partial<CodeConfig> & {
    codeConfig: Partial<CodeConfig>
  } & T
) {
  const {
    lineNumbers,
    showCopyButton,
    showExpandButton,
    minZoom,
    maxZoom,
    ...rest
  } = props
  const codeConfig = {
    ...props.codeConfig,
    maxZoom:
      maxZoom == null ? props.codeConfig?.maxZoom : maxZoom,
    minZoom:
      minZoom == null ? props.codeConfig?.minZoom : minZoom,
    horizontalCenter:
      props.codeConfig?.horizontalCenter ??
      props.horizontalCenter,
    lineNumbers:
      lineNumbers == null
        ? props.codeConfig?.lineNumbers
        : lineNumbers,
    showCopyButton:
      showCopyButton == null
        ? props.codeConfig?.showCopyButton
        : showCopyButton,
    showExpandButton:
      showExpandButton == null
        ? props.codeConfig?.showExpandButton
        : showExpandButton,
    rows: props.rows,
    debug: props.debug ?? props.codeConfig?.debug,
    transformCopyContent: props.transformCopyContent 
  }
  return { ...rest, codeConfig }
}

export function InnerCode({
  onTabClick,
  ...props
}: EditorProps & {
  onTabClick?: (filename: string) => void
} & Partial<CodeHikeConfig>) {
  const { className, style, codeConfig, ...editorProps } =
  mergeCodeConfig(props)

  if (
    !editorStep.southPanel &&
    editorStep.files.length === 1 &&
    !editorStep.files[0].name
  ) {
    return (
      <div
        className={`ch-codeblock not-prose ${
          className || ""
        }`}
        data-ch-theme={globalConfig.themeName}
        style={style}
      >
        <CodeSpring
          className="ch-code"
          config={config}
          step={editorStep.files[0]}
        />
      </div>
    )
  } else {
    const frameProps = {
      // ...editorStep?.frameProps,
      onTabClick,
    }
    return (
      <div
        className={`ch-codegroup not-prose ${
          className || ""
        }`}
        data-ch-theme={globalConfig.themeName}
        style={style}
      >
        <EditorSpring
          {...editorStep}
          frameProps={frameProps}
          codeConfig={config}
        />
      </div>
    )
  }
}

export function mergeCodeConfig(
  globalConfig: GlobalConfig,
  local: CodeConfigProps & ElementProps
) {
  const {
    // ignore these
    staticMediaQuery,
    themeName,
    triggerPosition,
    // keep the rest
    ...global
  } = globalConfig
  return {
    ...global,
    ...local,
    lineNumbers: local.lineNumbers ?? global.lineNumbers,
    maxZoom: local.maxZoom ?? global.maxZoom,
    minZoom: local.minZoom ?? global.minZoom,
    horizontalCenter:
      local.horizontalCenter ?? global.horizontalCenter,
    showCopyButton:
      local.showCopyButton ?? global.showCopyButton,
  }
}

export function updateEditorStep(
  step: EditorStep,
  filename: string | undefined,
  focus: string | null
): EditorStep {
  const name = filename || step.northPanel.active
  const newFiles = step.files.map((file: any) =>
    file.name === name
      ? {
          ...file,
          focus: focus === null ? file.focus : focus,
        }
      : file
  )

  let northPanel = { ...step.northPanel }
  let southPanel = step.southPanel && {
    ...step.southPanel,
  }
  if (step.northPanel.tabs.includes(name)) {
    northPanel.active = name
  } else if (southPanel) {
    southPanel.active = name
  }
  return { files: newFiles, northPanel, southPanel }
}
