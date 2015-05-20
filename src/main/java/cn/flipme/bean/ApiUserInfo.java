package cn.flipme.bean;

public class ApiUserInfo implements java.io.Serializable {

	private static final long serialVersionUID = 1L;
	
	private String scode;
	private String unit;
	private String username;
	private String phone;
	private String email;
	private String postscript;
	
	public ApiUserInfo(){
		
	}
public ApiUserInfo(String unit,String username,String phone,String email,String postscript){
		this.unit=unit;
		this.username=username;
		this.phone=phone;
		this.email=email;
		this.postscript=postscript;
	}
public String getScode() {
	return scode;
}
public void setScode(String scode) {
	this.scode = scode;
}
public String getUnit() {
	return unit;
}
public void setUnit(String unit) {
	this.unit = unit;
}
public String getUsername() {
	return username;
}
public void setUsername(String username) {
	this.username = username;
}
public String getPhone() {
	return phone;
}
public void setPhone(String phone) {
	this.phone = phone;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPostscript() {
	return postscript;
}
public void setPostscript(String postscript) {
	this.postscript = postscript;
}
public String toString(){
	return String.format("scode:%s，单位：%s，联系人：%s，电话：%s，邮件：%s，备注：%s", scode,unit,username,phone,email,postscript);
}
}
