package cn.flipme.dao;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;

import cn.flipme.bean.ApiUserInfo;

public class ConsoleTest {
	@SuppressWarnings("unchecked")
    public static void main(String[] args) {
		System.out.println("Maven3 + Hibernate + MySQL5.5");
        //Session session = HibernateUtil.getSessionFactory().openSession();
        Session session = HibernateUtil.getSessionFactory().getCurrentSession();
        
        session.beginTransaction();
        String hqlScode = "select max(scode)+1 from ApiUserInfo";
        Query queryScode = session.createQuery(hqlScode);
        int scode=(int)queryScode.list().get(0);

        
        	ApiUserInfo userInfo=new ApiUserInfo();
        	userInfo.setEmail("email");
        	userInfo.setPhone("18888888");
        	userInfo.setPostscript("postscript");
        	userInfo.setScode(scode+"");
        	userInfo.setUsername("联系人");
        	userInfo.setUnit("山东旅游局");
        	session.save(userInfo);
/*        session.getTransaction().commit();
        
        session.beginTransaction();*/
	        String hqlSelect = "from ApiUserInfo where unit=:unit";
	        Query query = session.createQuery(hqlSelect);
	        query.setParameter("unit", "山东旅游局");
	        List<ApiUserInfo> users = query.list();
	    session.getTransaction().commit();
	    HibernateUtil.shutdown();    
        //HibernateUtil.getSessionFactory().close();

        for (ApiUserInfo user : users) {
            System.out.println("User name: " + user.getUsername());
            System.out.println("UserInfo: " + user);
        }
    }
}
