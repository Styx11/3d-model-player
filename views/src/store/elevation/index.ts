// 存放高程提取列表信息

import { toRaw } from 'vue'
import { Module } from 'vuex'
import { RootState } from '../index'
import { ElevationPoint, ToolType } from '../../interface/Types'

export interface ElevationPointList
{
	list: ElevationPoint[];
}

export enum ElevationPointListMutation
{
	INIT_ELEVATION = 'elevation/initElevationList',
	ADD_ELEVATION = 'elevation/addElevationPoint',
	REMOVE_ELEVATION = 'elevation/removeElevationPoint',
}

export const elevation: Module<ElevationPointList, RootState> = {
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
		removeElevationPoint(state: ElevationPointList, key: string)
		{
			for (let i = 0; i < state.list.length; i++)
			{
				if (state.list[i].key === key)
				{
					state.list.splice(i, 1)
				}
			}
		}
	}
}