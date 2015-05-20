package cn.flipme.servlet;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import utils.Base64Image;
import utils.FileUtil;
import cn.flipme.bean.TuyaAction;

/**
 * Servlet implementation class Storage
 */
public class Storage extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Storage() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		System.out.println("storage: request form: GET");
		doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		//response.setContentType("application/json;charset=UTF-8");
		response.setHeader("Access-Control-Allow-Origin", "*");
		PrintWriter out=response.getWriter();

		System.out.println("storage: request form: POST");
		String name=request.getParameter("name");
		String picData=request.getParameter("picdata");
		String actions=request.getParameter("actions");
		String imgId=request.getParameter("imgid");
/*		List<TuyaAction> tuyaAction=JSON.parseArray(actions, TuyaAction.class);
		System.out.println(tuyaAction.size());
		System.out.println(JSON.toJSONString(tuyaAction));
		
		
		Enumeration<String>  params=request.getParameterNames();
		while(params.hasMoreElements()){
			System.out.println(params.nextElement());
		}
		System.out.println(name);
		System.out.println(picData);
		System.out.println(actions);*/
		if(picData!=null&&picData.length()>22){
			picData=picData.replaceFirst("data:image/png;base64,", "");
			if(imgId==null||imgId.trim().length()==0){
				imgId=Base64Image.base64UUID();
			}
			String filePath=imgId+".txt"; //"hello.txt";
			String imgPath=imgId+".png"; //hello.png";
			String dir="/upload";//一定要有“/”
			//System.out.println(getServletContext().getRealPath("/uploadI"));
			File f=new File(getServletContext().getRealPath(dir));
			if(!f.exists())f.mkdir();//如果文件夹不存在就创建一个
			String realPath=getServletContext().getRealPath(dir);
			String realImgPath=realPath+File.separatorChar+imgPath;
			String realFilePath=realPath+File.separatorChar+filePath;
			System.out.println(realImgPath);
			
			FileUtil.writeToFile(realFilePath,actions);
			Base64Image.base64ToImage(picData, realImgPath);
			
			
			out.print(imgId);
			//System.out.println(readFromFile(realFilePath));
		}else{
			out.print("false");
		}
	}
	


}
