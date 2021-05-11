import { PositionMaker, HEIGHT_OFFSET } from "./cesium"
import { ProjectionAlias } from '@/interface/Types'
import proj4 from 'proj4'

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

export const convertProjection = (proj1: ProjectionAlias | string, proj2: ProjectionAlias | string, coord: any) =>
{
	proj4.defs("EPSG:32650", "+proj=utm +zone=50 +datum=WGS84 +units=m +no_defs");
	proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs");

	return proj4(proj1, proj2, coord);
}

// 坐标转换
export const convertPosition = (point: PositionMaker, coordinateType: ProjectionAlias) =>
{
	switch (coordinateType)
	{
		case ProjectionAlias.WGS84:
			return {
				x: point.x,
				y: point.y,
				z: point.z,
			}
		case ProjectionAlias.EPSG_32650:
			const gpsPoint = convertProjection(ProjectionAlias.WGS84, ProjectionAlias.EPSG_32650, [point.y, point.x])
			return {
				x: gpsPoint[1] as number,
				y: gpsPoint[0] as number,
				z: point.z,
			}
		case ProjectionAlias.LOCAL:
			const localPoint = convertProjection(ProjectionAlias.WGS84, ProjectionAlias.LOCAL, [point.y, point.x])
			return {
				x: localPoint[1] as number,
				y: localPoint[0] as number,
				z: point.z
			}
		default:
			break;
	}
}

// 数据转换为 csv 文本数据
export const dataSrc2Csv = (ds: any, projection: ProjectionAlias) =>
{
	let result = ''

	if (projection === ProjectionAlias.WGS84)
	{
		result = 'lat, lng, alt\r\n';

		ds.forEach((d) =>
		{
			result += `${d.y.toFixed(5)}, ${d.x.toFixed(5)}, ${d.z.toFixed(5)}\r\n`;
		});
	}
	else
	{
		result = '东, 北, 高\r\n';

		// x and y are swapped between LOCAL and UTM
		ds.forEach((d) =>
		{
			if (projection === ProjectionAlias.LOCAL)
			{
				result += `${d.x.toFixed(5)}, ${d.y.toFixed(5)}, ${d.z.toFixed(5)}\r\n`;
			}
			else
			{
				result += `${d.y.toFixed(5)}, ${d.x.toFixed(5)}, ${d.z.toFixed(5)}\r\n`;
			}
		});
	}

	return result;

}

// 下载文件
export const download = (filename: string, text: string, fileType: string) =>
{
	const element = document.createElement('a');
	// @todo - should probably validate filename with fileType??

	let hrefType;
	switch (fileType)
	{
		case 'txt':
			hrefType = 'data:text/plain;charset=utf-8,';
			break;
		default:
			hrefType = 'data:text/plain;charset=utf-8,';
	}
	element.setAttribute('href', hrefType + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}