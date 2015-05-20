package utils;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.UUID;

import org.apache.commons.codec.binary.Base64;

public class Base64Image {

	public static void main(String[] args){
/*		String base64Data=imageToBase64("C:\\Users\\rsvp\\Desktop\\test.png");
		System.out.println(base64Data);
		base64ToImage(base64Data,"C:\\Users\\rsvp\\Desktop\\test1.png");
		base64ToImage(base64Data,"C:\\Users\\rsvp\\Desktop\\test1.jpg");*/
		System.out.println(base64UUID());
	}

public static String imageToBase64(String path) {// 将图片文件转化为字节数组字符串，并对其进行Base64编码处理
	byte[] data = null;
	// 读取图片字节数组
	try {
		InputStream in = new FileInputStream(path);
		data = new byte[in.available()];
		in.read(data);
		in.close();
	} catch (IOException e) {
		e.printStackTrace();
	}
	// 对字节数组Base64编码
	//BASE64Encoder encoder = new BASE64Encoder();
	//return encoder.encode(data);// 返回Base64编码过的字节数组字符串
	//用Apache codec 替换Sun内部API sun.misc.BASE64Encoder  
	return Base64.encodeBase64String(data);
}

/**
 * @Descriptionmap 对字节数组字符串进行Base64解码并生成图片
 * @param base64 图片Base64数据
 * @param path 图片路径
 * @return
 */
public static boolean base64ToImage(String base64, String path) {// 对字节数组字符串进行Base64解码并生成图片
	if (base64 == null){ // 图像数据为空
		return false;
	}
	//BASE64Decoder decoder = new BASE64Decoder();
	try {
		// Base64解码
		byte[] bytes=Base64.decodeBase64(base64);
		//byte[] bytes = decoder.decodeBuffer(base64);
		for (int i = 0; i < bytes.length; ++i) {
			if (bytes[i] < 0) {// 调整异常数据
				bytes[i] += 256;
			}
		}
		// 生成jpeg图片
		OutputStream out = new FileOutputStream(path);
		out.write(bytes);
		out.flush();
		out.close();
		return true;
	} catch (Exception e) {
		e.printStackTrace();
		return false;
	}
}

public static String getUid(){
	return Long.toString(new Date().getTime(), 20);
}
public static String uuid() {
    UUID uuid = UUID.randomUUID();
    return uuid.toString();
}

public static String base64UUID() {
    UUID uuid = UUID.randomUUID();
    return compressedUUID(uuid);
}

protected static String compressedUUID(UUID uuid) {
    byte[] byUuid = new byte[16];
    long least = uuid.getLeastSignificantBits();
    long most = uuid.getMostSignificantBits();
    long2bytes(most, byUuid, 0);
    long2bytes(least, byUuid, 8);
    String compressUUID = Base64.encodeBase64URLSafeString(byUuid);
    return compressUUID;
}

protected static void long2bytes(long value, byte[] bytes, int offset) {
    for (int i = 7; i > -1; i--) {
        bytes[offset++] = (byte) ((value >> 8 * i) & 0xFF);
    }
}

public static String compress(String uuidString) {
    UUID uuid = UUID.fromString(uuidString);
    return compressedUUID(uuid);
}

public static String uncompress(String compressedUuid) {
    if (compressedUuid.length() != 22) {
        throw new IllegalArgumentException("Invalid uuid!");
    }
    byte[] byUuid = Base64.decodeBase64(compressedUuid + "==");
    long most = bytes2long(byUuid, 0);
    long least = bytes2long(byUuid, 8);
    UUID uuid = new UUID(most, least);
    return uuid.toString();
}

protected static long bytes2long(byte[] bytes, int offset) {
    long value = 0;
    for (int i = 7; i > -1; i--) {
        value |= (((long) bytes[offset++]) & 0xFF) << 8 * i;
    }
    return value;
}
}