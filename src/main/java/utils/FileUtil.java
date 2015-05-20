package utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileUtil {
	public static void writeToFile(String filename,String content)  throws IOException{
			File file = new File(filename);
			   // if file doesn't exists, then create it
			   if (!file.exists()) {
			    file.createNewFile();
			   }
	
			   FileWriter fw = new FileWriter(file.getAbsoluteFile());
			   BufferedWriter bw = new BufferedWriter(fw);
			   bw.write(content);
			   bw.close();
	}
	public static  String readFromFile(String filename) throws IOException{
			File file=new File(filename);
		    if(!file.exists()||file.isDirectory())
		        throw new FileNotFoundException();
		    BufferedReader br=new BufferedReader(new FileReader(file));
		    String temp=null;
		    StringBuffer sb=new StringBuffer();
		    temp=br.readLine();
		    while(temp!=null){
		        sb.append(temp);
		        temp=br.readLine();
		    }
		    br.close();
		    return sb.toString();
		}
}
