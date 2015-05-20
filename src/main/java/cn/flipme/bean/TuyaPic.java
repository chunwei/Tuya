package cn.flipme.bean;

import java.util.Date;
import java.util.List;

public class TuyaPic {
	private String url;
	private String author;
	private Date created;
	private List<TuyaAction> actions;
	
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public Date getCreated() {
		return created;
	}
	public void setCreated(Date created) {
		this.created = created;
	}
	public List<TuyaAction> getActions() {
		return actions;
	}
	public void setActions(List<TuyaAction> actions) {
		this.actions = actions;
	}
	
}
