import crypto from 'crypto-js'

export default class StorageManager
{
	private static _instance: StorageManager

	static getInstance()
	{
		if (!this._instance)
		{
			this._instance = new StorageManager()
		}
		return this._instance
	}

	getItem<T>(key: string)
	{
		const valStr = localStorage.getItem(key)
		return !!valStr ? (JSON.parse(valStr) as T) : null
	}

	setItem(key: string, value: any)
	{
		localStorage.setItem(key, JSON.stringify(value))
	}

	setEncryptItem(key: string, value: any, salt: string)
	{
		const word = JSON.stringify(value)
		const encryptedStr = this.encrypt(word, salt)
		localStorage.setItem(key, `${encryptedStr},${salt}`)
	}

	getDecodeItem<T>(key: string)
	{
		const valStr = localStorage.getItem(key)
		if (valStr)
		{
			const strArry = valStr.split(',')
			if (strArry.length === 2)
			{
				const word = strArry[0]
				const pkey = strArry[1]
				const jsonStr = this.decrypt(word, pkey)
				return jsonStr ? (JSON.parse(jsonStr) as T) : null
			}
		}
		return null
	}

	encrypt(word: string, privateKey: string)
	{
		const encrypted = crypto.AES.encrypt(word, privateKey);
		return encrypted.toString()
	}

	decrypt(encryptedWord: string, privateKey: string)
	{
		try
		{
			const decrypt = crypto.AES.decrypt(encryptedWord, privateKey);
			return decrypt.toString(crypto.enc.Utf8)
		}
		catch (err)
		{
			return null
		}
	}

	removeItem(key: string)
	{
		localStorage.removeItem(key)
	}
}