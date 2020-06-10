package com.envisioniot.enos;

import com.envisioniot.enos.iot_http_integration.HttpConnection;
import com.envisioniot.enos.iot_http_integration.message.IntegrationAttributePostRequest;
import com.envisioniot.enos.iot_http_integration.message.IntegrationResponse;
import com.envisioniot.enos.iot_mqtt_sdk.core.exception.EnvisionException;
import com.envisioniot.enos.sdk.data.DeviceInfo;
import com.google.common.collect.Maps;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Properties;

public class FileAttributePostSample {
  public static void main(String[] args) {
    try {

      final Properties props = new Properties();
      props.load(ClassLoader.getSystemResourceAsStream("env.properties"));

      // EnOS Token Server URL and HTTP Broker URL, which can be obtained from Environment Information page in EnOS Console
      final String TOKEN_SERVER_URL = props.getProperty("TOKEN_SERVER_URL");
      final String BROKER_URL = props.getProperty("BROKER_URL");

      // EnOS Application AccessKey and SecretKey, which can be obtain in Application Registration page in EnOS Console
      final String APP_KEY = props.getProperty("APP_KEY");
      final String APP_SECRET = props.getProperty("APP_SECRET");

      // Device credentials, which can be obtained from Device Details page in EnOS Console
      final String ORG_ID = props.getProperty("ORG_ID");
      final String ASSET_ID = props.getProperty("ASSET_ID");
      final String PRODUCT_KEY = props.getProperty("PRODUCT_KEY");
      final String DEVICE_KEY = props.getProperty("DEVICE_KEY");

      // Construct a http connection
      final HttpConnection connection = new HttpConnection.Builder(
              BROKER_URL, TOKEN_SERVER_URL, APP_KEY, APP_SECRET, ORG_ID)
              .build();

      final DeviceInfo deviceInfo1 = new DeviceInfo().setAssetId(ASSET_ID);
      deviceInfo1.setKey(PRODUCT_KEY, DEVICE_KEY);

      final HashMap<String, Object> hashMap = Maps.newHashMap();
      hashMap.put("deviceManual", new File("manual.txt"));

      IntegrationAttributePostRequest request = IntegrationAttributePostRequest.builder()
              .addAttribute(deviceInfo1, hashMap)
              .build();

      final IntegrationResponse response = connection.publish(request, (bytes, length) ->
              System.out.println(String.format("Progress: %.2f %%", (float) bytes / length * 100.0)));

      System.out.println(new GsonBuilder().setPrettyPrinting().create().toJson(response));
    } catch (EnvisionException | IOException e) {
      e.printStackTrace();
    }
  }
}
