/**
 * All IPC Channels for the main process
 */
const IPCMainChannelName = {
	TEST_MAIN_CHANNEL: 'TEST_MAIN_CHANNEL',
	INIT_RENDERER_STORE: 'INIT_RENDERER_STORE',   // 初始化 vuex
	FIND_MODEL_FILE: 'FIND_MODEL_FILE',           // 查找模型文件
	UPLOAD_MODEL_FILE: 'UPLOAD_MODEL_FILE',       // 上传模型文件
	REMOVE_MODEL_FILE: 'REMOVE_MODEL_FILE',       // 删除模型文件
	UPDATE_MODEL_DESC: 'UPDATE_MODEL_DESC',       // 更新模型描述文件，用于保存测绘工具数据
};

/**
 * All IPC Channels for the renderer process
 */
const IPCRendererChannelName = {

};

export
{
	IPCMainChannelName,
	IPCRendererChannelName,
};