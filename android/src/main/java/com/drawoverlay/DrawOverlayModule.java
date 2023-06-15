package com.drawoverlay;

import android.annotation.TargetApi;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.List;
import com.drawoverlay.utils.XiaomiUtils;

@ReactModule(name = DrawOverlayModule.NAME)
public class DrawOverlayModule extends ReactContextBaseJavaModule {
  public static final String NAME = "DrawOverlay";
  private static  final String LOG_TAG="DrawOverlayLogger";
  private static Bundle bundle = null;

  public DrawOverlayModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void invokeApp(ReadableMap params) {
    final ReactApplicationContext reactContext = getReactApplicationContext();
    ReadableMap data = params.hasKey("data") ? params.getMap("data") : null;

    if (data != null) {
      bundle = Arguments.toBundle(data);
    }

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M || Settings.canDrawOverlays(reactContext)) {
      openApp();
    }


    if (isAppOnForeground(reactContext)) {
      sendEvent();
    }
  }



  private void sendEvent() {
  final ReactApplicationContext reactContext = getReactApplicationContext();
   if (bundle != null) {
     reactContext
       .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
       .emit("data", Arguments.fromBundle(bundle));
     bundle = null;
   }
  }



  @ReactMethod
  public  void canDrawOverlays(final Promise promise){
    try{
      final ReactApplicationContext reactContext= getReactApplicationContext();
      final WritableMap data = Arguments.createMap();
      boolean isXiaomi = XiaomiUtils.isMIUI();
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        if(isXiaomi){
          boolean inBackground= XiaomiUtils.checkXiaomiPermission(reactContext,XiaomiUtils.OP_BACKGROUND_START_ACTIVITY);
          boolean inLocked = XiaomiUtils.checkXiaomiPermission(reactContext,XiaomiUtils.OP_SHOW_WHEN_LOCKED);
          data.putString("inBackground",inBackground ? "granted" :"denied");
          data.putString("inLocked",inLocked ? "granted" :"denied");
        }
        boolean canDraw = Settings.canDrawOverlays(reactContext);
        data.putString("canDrawOverlays",canDraw ? "granted" :"denied");
        if(!isXiaomi || canDraw){
          String status = canDraw ? "granted" :"denied";
          data.putString("inBackground",status);
          data.putString("inLocked", status);
        }
      }else{
        promise.reject(new Throwable("your device is not support this feature"));
      }
      promise.resolve(data);
    }catch (Exception e){
      Log.d(LOG_TAG,"Not be able to check");
    }
  }
  @TargetApi(Build.VERSION_CODES.M)
  @ReactMethod
  public void openOverlaySetting(){
   try{
     boolean isXiaomi = XiaomiUtils.isMIUI();
     final ReactApplicationContext reactContext = getReactApplicationContext();
     if(isXiaomi) {
       Intent intent = XiaomiUtils.getPermissionManagerIntent(reactContext);
       intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
       reactContext.startActivity(intent);
      }else{
          Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:"+reactContext.getPackageName()));
          intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
          reactContext.startActivityForResult(intent,24,null);
        }
      }catch (Exception e){
        Log.d(LOG_TAG,"Your device is not support");
      }
    }

  private boolean isAppOnForeground(ReactApplicationContext context) {
    final ReactApplicationContext reactContext = getReactApplicationContext();
    ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
    List<ActivityManager.RunningAppProcessInfo> appProcesses = activityManager.getRunningAppProcesses();
    if (appProcesses == null) {
      return false;
    }
    final String packageName = reactContext.getPackageName();
    for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
      if (appProcess.importance == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND
        && appProcess.processName.equals(packageName)) {
        return true;
      }
    }
    return false;
  }

  private void openApp() {
    try {
      final ReactApplicationContext reactContext = getReactApplicationContext();
      String packageName = reactContext.getPackageName();
      Intent launchIntent = reactContext.getPackageManager().getLaunchIntentForPackage(packageName);
      String className = launchIntent.getComponent().getClassName();

      Class<?> activityClass = Class.forName(className);
      Intent activityIntent = new Intent(reactContext, activityClass);
      activityIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

      reactContext.startActivity(activityIntent);
    } catch(Exception e) {
      Log.e(LOG_TAG, "Class not found", e);
    }
  }

  }
