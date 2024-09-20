import { ECharts, EChartsOption, GraphSeriesOption } from 'echarts'
import { ChangeEvent } from 'react'

export const formatScoreValue = (score: number): string => {
    return Math.round(score).toLocaleString()
}

export const formatLinkLabel = (params: any): any => {
    return params.value ?? ''
}

export const formatNodeLabel = (params: any): any => {
    return params.name
}

export const buildTr = (left: string, right: string): string => {
    return `<tr><td><b>${left}:&nbsp;</b></td><td>${right}</td></tr>`
}

export const selectNode = (e: ChangeEvent<HTMLSelectElement>, graph: ECharts | null) => {
    if (e.target.value !== '-1') {
        graph?.dispatchAction({
            type: 'highlight',
            dataIndex: [e.target.value],
        })
    }
}

export const zoom = (inOut: string, 
                     transformData: (map: any) => any, 
                     map: any,
                     getGraphOption: (data: any, zoom: number) => EChartsOption,
                     graph: ECharts | null) => {
    const graphData = transformData(map!)

    const option = graph?.getOption() as EChartsOption
    const series = option?.series as GraphSeriesOption[]
    let _zoomValue = series[0].zoom ?? 0.2
    if (inOut === '+') {
        _zoomValue += 0.05
        if (_zoomValue >= 1.0)
            _zoomValue = 1
    } else {
        _zoomValue -= 0.05
        if (_zoomValue <= 0.04)
            _zoomValue = 0.04
    }
    graph?.setOption(getGraphOption(graphData, _zoomValue), { notMerge: false, lazyUpdate: true })
}

export const getSymbolSize = (selectedResourceType: string, currentResourceType: string, maxScore: number, minScore: number, score: number): number => {
    const minSize: number = 25
    const maxSize: number = 85
    if (selectedResourceType === currentResourceType)
        return 40
    else {
        // for example: the score is 35500, minScore is 15000, maxScore is 50000, the size can be between 20 and 40 => 
        // 1 point between 20 and 40 means 35000/20=1750 value distance between 15000 and 50000 => (35500-15000)/1750=11.7142 has to be added to 20 find the symbol size: 31.7142
        const onePintDistanceinScore: number = (maxScore - minScore) / (maxSize - minSize)
        return minSize + ( (score - minScore) / onePintDistanceinScore )
    }
}

export const resizeGraph = (graph: ECharts | null): void => {
    graph?.resize()
}
