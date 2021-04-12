
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