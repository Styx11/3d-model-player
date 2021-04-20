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
 * 使用Cartesian坐标计算多边形面积
 * @param points
 * @param coordinateProjection
 */
export const calcAreaCartesian3 = (points: PositionMaker[]) =>
{
	/*
	// @todo - 对凹多边形还不是很好的支持
	let res = 0;
	//拆分三角曲面
 
	for (let i = 0; i < points.length - 3; i++)
	{
		const j = (i + 1) % points.length;
		const k = (i + 2) % points.length;
		const totalAngle = Angle(points[0], points[j], points[k]);
		const dis_temp1 = getDistance(points[0], points[j]);
		const dis_temp2 = getDistance(points[j], points[k]);
		res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) / 2;
	}
	*/

	let total = 0;
	const getPoints = points.map((p) =>
	{
		const cartesian = p.cartesian

		return {
			x: cartesian.x,
			y: cartesian.y,
			h: p.z,
		};
	});

	const length = getPoints.length
	if (length >= 2)
	{
		// 多边形算法：https://www.mathopenref.com/coordpolygonarea.html
		for (let i = 0; i < length; i++)
		{
			const addX = getPoints[i].x;
			const addY = getPoints[i === length - 1 ? 0 : i + 1].y;
			const subX = getPoints[i === length - 1 ? 0 : i + 1].x;
			const subY = getPoints[i].y;

			total += (addX * addY * 0.5);
			total -= (subX * subY * 0.5);
		}
	}

	return Math.abs(total).toFixed(4);
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