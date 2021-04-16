import { PositionMaker } from "./cesium"

/**
 * 函数节流
 * @param fn target function
 * @param delay delay millisecond
 */
export const throttle = (fn, delay) =>
{
	var prev = Date.now()
	return function (...args)
	{
		var now = Date.now()
		if (now - prev > delay)
		{
			fn(...args)
			prev = Date.now()
		}
	}
}

/**
 * 使用Cartesian坐标计算两点间的距离
 * @param p1
 * @param p2
 * @param coordinateProjection
 */
export const calcDistanceCartesian3 = (p1: PositionMaker, p2: PositionMaker) =>
{
	const p1Cartesian3 = p1.cartesian;
	const p2Cartesian3 = p2.cartesian;

	// const distance = Cesium.Cartesian3.distance(p1Cartesian3, p2Cartesian3)
	const distance = Math.sqrt(Math.pow(p1Cartesian3.x - p2Cartesian3.x, 2) + Math.pow(p1Cartesian3.y - p2Cartesian3.y, 2));

	return distance;
}

/**
* 计算一组点的总长（通常是一条线）
* @param points - PositionMarker[]
*/
export const getPointsDistance = (points: PositionMaker[]): number =>
{
	let total = 0;
	points.reduce((a, b) =>
	{
		total += calcDistanceCartesian3(a, b);
		return b;
	});
	return parseFloat(total.toFixed(3))
}

/**
* 计算两点间的高度差（对于线段来说是第一个和最后一个点的高度差）
* @param points - PositionMarker[]
*/
export const getOverallHeightDiff = (points: PositionMaker[]) =>
{
	if (!points || points.length === 0) return 0;
	const p1 = points[0];
	const p2 = points[points.length - 1];

	if (!p1 || !p2) return 0;
	return (p1.z - p2.z).toFixed(3);
}