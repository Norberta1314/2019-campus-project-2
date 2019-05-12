import request from "../utils/request";
import {buildHttpQuery} from "../utils/utils";

export async function queryOrganizationsEdit() {
    return request('award/organizations')
}


export async function queryIndexHis(param) {
    const {page = 1} = param
    return request('index/last?page=' +  page)
}


export async function queryOrganizations(param) {
    const {page = 1, query = {}} = param
    return request(`organizations?page=${page}&${buildHttpQuery(query)}`)
}

export async function createOrgan(param) {
    return request('organization', {
        method: 'POST',
        body: param
    })
}


export async function deleteOrgan(id) {
    return request(`organization/${id}`, {
        method: 'DELETE'
    })
}

export async function updateOrgan(param) {
    const {id, data} = param
    return request(`organization/${id}`, {
        method: 'PUT',
        body: data
    })
}


export async function queryAwards(param) {
    const {page = 1, query = {}} = param
    return request(`awards?page=${page}&${buildHttpQuery(query)}`)
}

export async function queryAward(id) {
    return request(`award/${id}`)
}

export async function cAward(param) {
        return request('award', {
        method: 'POST',
        body: param
    })
}


export async function dAward(id) {
        return request(`award/${id}`, {
        method: 'DELETE'
    })
}

export async function uAward(param) {
    const {id, data} = param
    return request(`award/${id}`, {
        method: 'PUT',
        body: data
    })
}


export async function queryMyApplys(param) {
    const {page = 1} = param
    return request(`my/applys?page=${page}`)
}


export async function queryChecks(param) {
    const {page = 1} = param
    return request(`my/checks?page=${page}`)
}


export async function toApplyAward(param) {
    const {id, data} = param
    return request(`my/apply/${id}`, {
        method: 'POST',
        body: data
    })
}


export async function updateApply(param) {
    const {id, data} = param
    return request(`my/apply/${id}`, {
        method: 'PUT',
        body: data
    })
}


export async function queryApplyWard(id) {
    return request(`myapply/award/${id}`)
}

export async function queryApplyDetail(id) {
    return request(`my/apply/${id}`)
}


export async function passApply(id) {
    return request(`my/check/pass/${id}`, {
        method: 'PUT'
    })
}

export async function rejectApply(id) {
    return request(`my/check/reject/${id}`, {
        method: 'PUT'
    })
}


export async function queryIndexApplys() {
    return request(`index/applys`)
}