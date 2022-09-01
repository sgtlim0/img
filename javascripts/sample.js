/// <summary>
/// 트림 변경 데이터 전송 함수
/// </summary>
/// <param nationcd>국가코드</param>
/// <param fscgen>FSCGen 코드</param>
/// <param extcolor>외장 컬러 코드</param>
/// <param intcolor>내장 컬러 코드</param>
function onTrimCodeSend(nationcd, fscgen, extcolor, intcolor)
{
    let descriptor = {
        NationCd: nationcd,
        FSCGen: fscgen,
        ExtColor: extcolor,
        IntColor: intcolor
    };

    console.log(descriptor);
    document.getElementById('render_image').contentWindow.postMessage(descriptor, '*');
}

/// <summary>
/// 애니메이션 동작 전송 함수
/// </summary>
/// <param category>각 애니메이션 구분 카테고리</param>
/// 카테고리 목록
/// (외장)Door, DoorGlass, SideMirror, Lamp, Trunk, (내장)Sunroof, RelaxSeat, IslandConsoleMoving, StartButton, (환경)Showroom, DayNight, (카메라)CameraMove, ExtCamera
/// <param item>on/off 코드</param>
/// 각 카테고리 별 0(open or on), 1(close or off) / 카테고리가 CameraMove일 경우 0(EXT Camera), 1(INT Camera 운전석), 2(INT Camera 조수석), 3(INT Camera 운전석 뒷자리), 4(INT Camera 조수석 뒷자리) / 카테고리가 ExtCamera일 경우 0(사이드(디폴트) 뷰), 1(프론트 뷰), 2(프론트 쿼터), 3(사이드 뷰), 4(리어쿼터 뷰), 5(리어 뷰)
function onConfigurator(category, item)
{
    let descriptor = {
        Category: category,
        Item: item
    };

    document.getElementById('render_image').contentWindow.postMessage(descriptor, '*');
}

/// <summary>
/// 모든 vm이 사용 중이거나 웹 소켓 연결에 문제가 있을 경우 vm의 웹에서 close 데이터 전달
/// 유저 인풋 타임 아웃으로 인해 이미지 뷰로 넘어 갈때 현재 카메라 각도에서 가장 근접한 각도 수치 전달
/// </summary>
window.addEventListener('message', function(e) {

    console.log(e.data);
    if(e.data == "close")
    {
        // 이미지 뷰어로 이동
        this.alert('goto image');
    }

    if(e.data == "(정수형)")
    {
        this.alert('goto image', "(정수형 데이터)");
    }

});
