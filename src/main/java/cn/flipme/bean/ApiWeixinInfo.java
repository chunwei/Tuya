package cn.flipme.bean;

public class ApiWeixinInfo {
	private String stype="token";	
	private String scode="";
	private String publicname;//微信公众号名称的拼音
	private String originalId;//微信公众号原始id
	private String appId;//微信公众号开发者应用Id
	private String appSecret;//微信公众号开发者应用密钥
	private String type="1";//0:订阅号，1：服务号
	
	public ApiWeixinInfo(){
		
	}
public ApiWeixinInfo(String publicname,String orginalId,String appId,String appSecret,String type){
		this.publicname=publicname;
		this.originalId=orginalId;
		this.appId=appId;
		this.appSecret=appSecret;
		this.type=type;
	}

public String getStype() {
	return stype;
}
public void setStype(String stype) {
	this.stype = stype;
}
public String getScode() {
	return scode;
}
public void setScode(String scode) {
	this.scode = scode;
}
public String getPublicname() {
	return publicname;
}
public void setPublicname(String publicname) {
	this.publicname = publicname;
}
public String getOriginalId() {
	return originalId;
}
public void setOriginalId(String originalId) {
	this.originalId = originalId;
}
public String getAppId() {
	return appId;
}
public void setAppId(String appId) {
	this.appId = appId;
}
public String getAppSecret() {
	return appSecret;
}
public void setAppSecret(String appSecret) {
	this.appSecret = appSecret;
}
public String getType() {
	return type;
}
public void setType(String type) {
	this.type = type;
}
public String toString(){
	return String.format("stype:%s,scode:%s,publicname:%s,originalId:%s,appId:%s,appSecret:%s,type:%s",
								stype,scode,publicname,originalId,appId,appSecret,type);
}
}
