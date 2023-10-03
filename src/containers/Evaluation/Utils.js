import Constants from 'commons/Constants'
import { formulaConfig } from './Constants'

const formatIndexText = index => {
    const mapping = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V',
        6: 'VI',
        7: 'VII',
        8: 'VIII',
        9: 'IX',
        10: 'X',
    }
    return mapping[index]
}

const calculateRating = (score) => {
    if (score === null || score === undefined) {
        return ''
    }

    switch (true) {
        case score >= 95 && score <= 100:
            return 'A'
        case score >= 85 && score < 95:
            return 'B'
        case score >= 75 && score < 85:
            return 'C'
        case score >= 0 && score < 75:
            return 'D'
        default:
            return ''
    }
}

const formatTargetText = str => str?.replace(/\n|\r/g, "")

const isVinBusByCompanyCode = code => code === Constants.pnlVCode.VinBus

const formatEvaluationNumber = val => {
    return parseInt(val) === Number(val) ? val : Number(Number(val).toFixed(2)) || 0
}

const hasNotValue = val => {
    return val === null || val === undefined || val?.toString()?.trim() === ''
}

const calculateScore = (formulaCode, targetValue, weight, actualResult) => {
    if (actualResult === '') {
        return ''
    }

    try {
        let score = 0
        switch (formulaCode) {
            case formulaConfig.CT1:
                score = actualResult >= targetValue ? 100 * (weight/100) : 0
                break;
            case formulaConfig.CT2:
                score = actualResult <= targetValue ? 100 * (weight/100) : 0
                break;
            case formulaConfig.CT3:
                score = actualResult >= targetValue ? 100 * (weight/100) : (actualResult/targetValue) * (weight/100) * 100
                break;
            case formulaConfig.CT4:
                score = actualResult <= targetValue ? 100 * (weight/100) : (targetValue/actualResult) * (weight/100) * 100
                break;
        }
        return formatEvaluationNumber(score)
    } catch (error) {
        return ''
    }
}

export { formatIndexText, calculateRating, formatTargetText, calculateScore, isVinBusByCompanyCode, formatEvaluationNumber, hasNotValue }
