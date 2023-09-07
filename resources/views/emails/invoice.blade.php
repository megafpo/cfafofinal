<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <style type="text/css">
        @media only screen and (max-width: 550px),
        screen and (max-device-width: 550px) {
            body[yahoo] .buttonwrapper {
                background-color: transparent !important;
            }

            body[yahoo] .button {
                padding: 0 !important;
            }

            body[yahoo] .button a {
                background-color: #de4b39;
                padding: 15px 25px !important;
            }

            .items {
                padding: 10px 20px 0 20px;
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 10px;
                line-height: 20px;
                vertical-align: top;
            }

            .addons {
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 8px;
                line-height: 8px;
            }

            .calc {
                padding: 10px 20px 0 20px;
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 10px;
                line-height: 20px;
            }

            .order-info {
                font-family: Arial, sans-serif;
                font-size: 10px;
            }
        }

        @media only screen and (min-device-width: 601px) {
            .content {
                width: 600px !important;
            }

            .col387 {
                width: 387px !important;
            }

            .items {
                padding: 10px 20px 0 20px;
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 30px;
                vertical-align: top;
            }

            .addons {
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 10px;
            }

            .calc {
                padding: 10px 20px 0 20px;
                color: #555555;
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 30px;
            }

            .order-info {
                font-family: Arial, sans-serif;
                font-size: 14px;
            }
        }
    </style>
</head>

<body style="margin: 0; padding: 15px 0 15px 0; background:#f8f8f8; font-family: Arial, sans-serif;" yahoo="fix">
    <table align="center" border="0" cellpadding="0" cellspacing="0"
        style="border-collapse: collapse; width: 100%; max-width: 600px; background: white; padding: 30px 30px 30px 30px"
        class="content">
        <tr bgcolor="#FFFFFF">
            <td align="center" colspan="2"
                style="padding: 20px 20px 20px 20px; color: #ffffff; font-family: Arial, sans-serif; font-size: 36px; font-weight: bold;">
                <img src="{{ $message->embed(config('setting.storeUrl').'/assets/img/logos/logo.png') }}"
                    style="display:block;width: 160px;" />
            </td>
        <tr bgcolor="#fff">
            <td align="left" colspan="2" style="padding:12px;">
                <p style="font-size: 16px;">Hi <b>{{ $order->user->name }}</b></p>
                <p>
                    We hope you enjoyed your meal from <b>{{ $order->restaurant->name }}</b>
                    <br>
                    You can write them a review by clicking <a
                        href="{{config('setting.storeUrl')}}/rate-order/{{$order->id}}">here</a>
                </p>
            </td>
        <tr bgcolor="#FFFFFF">
            <td align="left" style="padding: 12px;" class="order-info">
                <p><b>Order ID:</b> {{ $order->unique_order_id }}</p>
                <p><b>Order Date:</b> {{ $order->created_at->format('Y-m-d  - h:i A')}} </p>
                <p><b>Payment Mode:</b> {{ $order->payment_mode }}</p>
                <p><b>Status: </b> <span style="color: #22d172;"> Delivered/Completed </span></p>
            </td>
        </tr>
        <tr>
            <td align="left" bgcolor="#ffffff" colspan="2" style="padding: 12px; color: #555555; line-height: 30px;"
                class="order-info">
                <p>Invoice issued on behalf of <b>{{ $order->restaurant->name }} </b> by
                    <b>{{ config('setting.storeName') }}</b></p>
        </tr>
        @php
        $subTotal = 0;
        function calculateAddonTotal($addons) {
        $total = 0;
        foreach ($addons as $addon) {
        $total += $addon->addon_price;
        }
        return $total;
        }
        @endphp
    </table>
    <table align="center" border="0" cellpadding="0" cellspacing="0"
        style="border-collapse: collapse; width: 100%; max-width: 600px;" class="content">
        <tr>
            <td align="left" bgcolor="#f9f9f9" class="items">
                <b>Item</b>
            </td>
            <td align="center" bgcolor="#f9f9f9" class="items">
                <b>Quantity</b>
            </td>
            <td align="right" bgcolor="#f9f9f9" class="items">
                <b>Price</b>
            </td>
        </tr>
        @foreach($order->orderitems as $item)
        <tr>
            <td align="left" bgcolor="#f9f9f9" class="items">
                {{ $item->name }} - {{ trim(config('setting.currencyFormat')) }}{{$item->price }}
                @if(count($item->order_item_addons))
                <div>
                    <table>
                        <tbody>
                            @foreach($item->order_item_addons as $addon)
                            <tr class="addons">
                                <td>{{ $addon->addon_name }}</td>
                                <td>{{ trim(config('setting.currencyFormat')) }}{{$addon->addon_price }}</td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                @endif
            </td>
            <td align="center" bgcolor="#f9f9f9" class="items">
                x {{ $item->quantity }}
            </td>
            @php
            $itemTotal = ($item->price +calculateAddonTotal($item->order_item_addons)) * $item->quantity;
            $subTotal = $subTotal + $itemTotal;
            @endphp
            <td align="right" bgcolor="#f9f9f9" class="items">
                {{ trim(config('setting.currencyFormat')) }}{{$itemTotal }}
            </td>
        </tr>
        @endforeach
        <tr>
            <td colspan="3" align="right" bgcolor="#f9f9f9" class="calc">
                <p><b>Sub Total: </b>{{ trim(config('setting.currencyFormat')) }}{{$subTotal }}</p>
                @if($order->coupon_amount != NULL)
                <p><b>Coupon: </b>{{ $order->coupon_name }}
                    ({{ trim(config('setting.currencyFormat')) }}{{ $order->coupon_amount }}) @endif </p>
                <p><b>Delivery Charge: </b>{{ trim(config('setting.currencyFormat')) }}{{$order->delivery_charge }} </p>
                @if($order->tax_amount != NULL)
                <p><b>Tax: </b>{{ $order->tax }}% {{ trim(config('setting.currencyFormat')) }}{{$order->tax_amount }}
                    @endif </p>
            </td>
        </tr>
        <tr>
            <td colspan="3" align="right" bgcolor="#f9f9f9" class="calc">
                <p><b>Total: </b>{{ trim(config('setting.currencyFormat')) }}{{$order->total }}</p>
            </td>
        </tr>
        <tr>
            <td align="center" colspan="3" bgcolor="#FFFFFF"
                style="padding: 12px 10px 12px 10px; font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; border-radius: 0px 0px 10px 10px;">
                Thank you for using {{ config('setting.storeName') }}
            </td>
        </tr>
    </table>
</body>

</html>