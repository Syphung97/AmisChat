declare const io: any;
const subscribe_callback = 'subscribe';
const new_event = 'new_event';

export var socketConnected = false;

export function subscribeCallback(socketUrl, context, func: Function = null) {

    if (socketConnected) {
        return;
    }

    const socket = io(socketUrl, {
        reconnection: true,
        reconnectionAttempts : 5
    });
    socket.on('connect', function () {
        /*
         * biến lưu socketId trả về từ server sau khi kết nối thành công
         * dùng để phân biệt với thông tin gửi từ server xem có phải phản hồi do mình gửi lên không
         */
        socket.on('OnJoinRoomSuccess', function (data) {
        });

        socket.emit('JoinRoom', context);

    });
    // Ngắt kết nối
    socket.on('disconnect', function (msg) {
    });
    // Sau khi kết nối xong
    socket.on('connected', function (msg) {
        socketConnected = true;
        socket.emit('DataChanged', context);
    });
    // Khi có sự thay đổi trên socket server Nhận dữ liệu về qua một new_event sau đó callback func
    socket.on('OnDataChanged', function (res) {
        if (func) {
            func(res);
        }
    });
}

