// 存放高程提取列表信息

import { toRaw } from 'vue'
import { Module } from 'vuex'
import { RootState } from '../index'
import { ElevationPoint } from '@/interface/Types'

export interface ElevationPointList
{
	list: ElevationPoint[];
}

export enum ElevationPointMutation
{
	INIT_ELEVATION = 'elevationPoint/initElevationList',
	ADD_ELEVATION = 'elevationPoint/addElevationPoint',
	UPDATE_ELEVATION = 'elevationPoint/updateElevationPoint',
	REMOVE_ELEVATION = 'elevationPoint/removeElevationPoint',
}

export const elevation: Module<ElevationPointList, RootState> = {
	namespaced: true,
	state: {
		list: [],
	},
	mutations: {
		initElevationList(state: ElevationPointList, payload: ElevationPoint[])
		{
			state.list = payload
			console.log('init elevation list =>', toRaw(state.list))
		},
		addElevationPoint(state: ElevationPointList, payload: ElevationPoint)
		{
			state.list.push(payload)
			console.log('add elevation point =>', toRaw(payload))
		},
		updateElevationPoint(state: ElevationPointList, payload: ElevationPoint)
		{
			for (let i = 0; i < state.list.length; i++)
			{
				if (state.list[i].key === payload.key)
				{
					state.list.splice(i, 1, payload)
					console.log('update elevation point =>', payload)
				}
			}
		},
		removeElevationPoint(state: ElevationPointList, key: string)
		{
			const matchIndex = state.list.findIndex(e => e.key === key)

			if (matchIndex > -1)
			{
				state.list.splice(matchIndex, 1)
				console.log('remove elevation point =>', key)
			}
		}
	}
}