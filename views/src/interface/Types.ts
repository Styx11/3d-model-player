import { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import { PositionMaker } from '../hooks/cesium'

// 模型上传表单
export interface IModelFormState
{
	title: string;
	tag: string;
	desc: string;
	location: string;
}

// 模型文件信息
export interface ModelFileState extends IModelFormState
{
	uid: string;
	name: string;         // name 带有文件名及后缀
	path: string;
	previewPath: string;  // 预览图地址
	size: number;
	uploadAt: number;
	lastModified: number;
}

// 测量工具类型
export enum ToolType
{
	NOTATION = 'notation',
	LINE = 'line',
	AREA = 'area',
	ELEVATION = 'elevation'
}

// 测量工具名称
export enum ToolTitle
{
	NOTATION = '标注工具',
	LINE = '距离工具',
	AREA = '面积工具',
	ELEVATION = '高程点区域',
}

// 实体标记色
export enum EntityColor
{
	RED = 'red',
	ORANGE = 'orange',
	YELLOW = 'yellow',
	GREEN = 'green',
	BLUE = 'blue',
	PURPLE = 'purple',
}

export const EntityTextColor =
{
	red: '#f03048',
	orange: '#fe8001',
	yellow: '#fee144',
	green: '#11b00e',
	blue: '#007aff',
	purple: '#983ff3',
}

// 实体树形数据（用于 Tree 组件和 Vuex）
export interface EntityTreeItem extends Omit<TreeDataItem, 'children' | 'key' | 'title'>
{
	key: ToolType;
	title: ToolTitle;
	children: EntityTreeChild[];
}

export interface EntityTreeChild extends Omit<TreeDataItem, 'key'>
{
	key: string;
	desc?: string;
	title: string;
	color: EntityColor;
	type: ToolType;
	position: PositionMaker[];
}

export interface ElevationPoint 
{
	key: string;
	title: string;
	show: boolean;
	showLabel: boolean;
	children: ElevationPointEntity[];
}

export interface ElevationPointEntity
{
	key: string;
	type: ToolType;
	position: PositionMaker;
}