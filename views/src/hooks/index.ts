import { ref, computed, Ref, UnwrapRef, reactive } from 'vue'

type BasicTypes = string | boolean | number

export type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

export const useState = <T extends BasicTypes>(value: T): [Ref<UnwrapRef<T>>, (newVal: UnwrapRef<T>) => void] =>
{
	const refValue: Ref<UnwrapRef<T>> = ref(value)
	return [
		refValue,
		(newVal: UnwrapRef<T>) => { refValue.value = newVal }
	]
}

export const useCollectionState = <T extends object>(collection: T): [UnwrapNestedRefs<T>, (newCol: UnwrapNestedRefs<T>) => void] =>
{
	const reactiveCol = reactive(collection)
	return [
		reactiveCol,
		(newCol: UnwrapNestedRefs<T>) =>
		{
			for (let k in newCol)
			{
				reactiveCol[k] = newCol[k]
			}
		}
	]
}

export const useMemo = <T>(fn: () => T): T =>
{
	return computed(fn).value
}
